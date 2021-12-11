import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';
import { AuthService } from './../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Injectable, BadRequestException, NotFoundException, ConflictException, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { addHours } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUuidDto } from './dto/verify-uuid.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { ForgotPassword } from './interfaces/forgot-password.interface';
import { User } from './interfaces/user.interface';
import * as nodemailer from 'nodemailer';
import { default as config } from '../config';
import { EmailVerification } from './interfaces/emailverification.interface';
import { userUpdateDto } from './dto/userUpdate.dto';
import { MailOptions } from '../mailer/interface/mailOptions';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class UserService {

    HOURS_TO_VERIFY = 4;
    HOURS_TO_BLOCK = 6;
    LOGIN_ATTEMPTS_TO_BLOCK = 5;

    constructor(
        @InjectModel('EmailVerification') private readonly emailVerificationModel: Model<EmailVerification>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('ForgotPassword') private readonly forgotPasswordModel: Model<ForgotPassword>,
        private readonly authService: AuthService,
        private readonly mailerService: MailerService,
    ) { }

    findAll(): any {
        return { hello: 'world' };
    }

    //crear user
    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new this.userModel(createUserDto);
        await this.isEmailUnique(user.email);
        this.setRegistrationInfo(user);
        await user.save();
        return this.buildRegistrationInfo(user);
    }

    //actualizar
    async upDateUser(userEmail: string, userUpdate: userUpdateDto): Promise<User> {
        const user = await this.userModel.findOneAndUpdate({ email: userEmail }, userUpdate, { new: true });
        return user;
    }

    async getUsers(): Promise<User[]> {
        const users = await this.userModel.find();
        return users;
    }

    //verificar email
    async verifyEmail(req: Request, verifyUuidDto: string) {
        console.log(verifyUuidDto);
        const user = await this.findByVerification(verifyUuidDto);
        console.log('ok')
        await this.setUserAsVerified(user);
        return {
            accessToken: await this.authService.createAccessToken(user),
            refreshToken: await this.authService.createRefreshToken(req, user._id),
        };
    }

    async sendEmailVerification(parm: string): Promise<boolean> {
        var model = await this.userModel.findOne({ email: parm });
        if (model != null) {

            const sendHtml = `Hola! <br><br> Gracias por registrarse,
            para verificar su cuenta haga click en el enlace y luego inicie sesión<br><br>
            <a href=https://api-nestjs-crediciim.herokuapp.com/user/api-verify-email/${model.verification}> Haga click aquí para activar su cuenta</a>
            <li></li>`
            //link href=http://localhost:8100/verify-email --> FRONTEND

            var mailOptions = <MailOptions>{
                to: model.email, // list of receivers (separated by ,)
                subject: 'Verificar Email',
                text: 'Verify Email',
                html: sendHtml
            };

            var sent = this.mailerService.createTransport(mailOptions);
            return sent
        } else {
            //throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
            return sent
        }
    }

    //Login
    async login(req: Request, loginUserDto: LoginUserDto) {
        const user = await this.findUserByEmail(loginUserDto.email);
        this.isUserBlocked(user);
        await this.checkPassword(loginUserDto.password, user);
        await this.passwordsAreMatch(user);
        return {
            accessToken: await this.authService.createAccessToken(user),
            refreshToken: await this.authService.createRefreshToken(req, user._id)
        };
    }

    //Login
    async loginWithProvider(req: Request, email: string) {
        const user = await this.findUserByEmail(email);
        console.log(user);
        this.isUserBlocked(user);
        return {
            accessToken: await this.authService.createAccessToken(user),
            refreshToken: await this.authService.createRefreshToken(req, user._id)
        };
    }

    //send maila new user login with provider
    public async sendMailToNewUser(mail: string) {
        const sendHtml = `Hola! <br><br> Gracias por registrarse en "Ayudarnos!"!`

        var mailOptions = <MailOptions>{
            to: mail, // list of receivers (separated by ,)
            subject: 'Email registrado',
            text: 'Verify Email',
            html: sendHtml
        };
        var sent = this.mailerService.createTransport(mailOptions);
        return sent;
    }

    //Refresh Token
    async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
        const userId = await this.authService.findRefreshToken(refreshAccessTokenDto.refreshToken);
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new BadRequestException('Bad request');
        }
        return {
            accessToken: await this.authService.createAccessToken(user)
        };
    }

    //Recuperar contraseña
    async forgotPassword(req: Request, createForgotPasswordDto: CreateForgotPasswordDto) {
        await this.findByEmail(createForgotPasswordDto.email);
        await this.saveForgotPassword(req, createForgotPasswordDto);
        return {
            email: createForgotPasswordDto.email,
            message: 'verification sent.',
        };
    }

    async forgotPasswordVerify(req: Request, verifyUuidDto: VerifyUuidDto) {
        const forgotPassword = await this.findForgotPasswordByUuid(verifyUuidDto);
        await this.setForgotPasswordFirstUsed(req, forgotPassword);
        return {
            email: forgotPassword.email,
            message: 'now reset your password.',
        };
    }

    //Reset contraseña
    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const forgotPassword = await this.findForgotPasswordByEmail(resetPasswordDto);
        await this.setForgotPasswordFinalUsed(forgotPassword);
        await this.resetUserPassword(resetPasswordDto);
        return {
            email: resetPasswordDto.email,
            message: 'password successfully chenaged.',
        };
    }

    //METODOS PRIVADOS
    private async isEmailUnique(email: string) {
        const user = await this.userModel.findOne({ email, verified: true });
        if (user) {
            throw new BadRequestException('Email most be unique.');
        }
    }

    private setRegistrationInfo(user): any {
        user.verification = v4();
        user.verificationExpires = addHours(new Date(), this.HOURS_TO_VERIFY);
    }

    private buildRegistrationInfo(user): any {
        const userRegistrationInfo = {
            fullName: user.fullName,
            loc: user.loc,
            imgURL: user.imgURL,
            name: user.name,
            email: user.email,
            verified: user.verified,
            verification: user.verification
        };
        return userRegistrationInfo;
    }

    private async findByVerification(verification: string): Promise<User> {
        const user = await this.userModel.findOne({ verification, verified: false, verificationExpires: { $gt: new Date() } });
        if (!user) {
            throw new BadRequestException('Bad request.');
        }
        return user;
    }

    private async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email, verified: true });
        if (!user) {
            throw new NotFoundException('Email not found.');
        }
        return user;
    }

    private async setUserAsVerified(user) {
        user.verified = true;
        await user.save();
    }

    public async findUserByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email, verified: true });
        if (!user) {
            throw new NotFoundException('Wrong email or password.');
        }
        return user;
    }

    private async checkPassword(attemptPass: string, user) {
        const match = await bcrypt.compare(attemptPass, user.password);
        if (!match) {
            await this.passwordsDoNotMatch(user);
            throw new NotFoundException('Wrong email or password.');
        }
        return match;
    }

    private isUserBlocked(user) {
        if (user.blockExpires > Date.now()) {
            throw new ConflictException('User has been blocked try later.');
        }
    }

    private async passwordsDoNotMatch(user) {
        user.loginAttempts += 1;
        await user.save();
        if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
            await this.blockUser(user);
            throw new ConflictException('User blocked.');
        }
    }

    private async blockUser(user) {
        user.blockExpires = addHours(new Date(), this.HOURS_TO_BLOCK);
        await user.save();
    }

    private async passwordsAreMatch(user) {
        user.loginAttempts = 0;
        await user.save();
    }

    private async saveForgotPassword(req: Request, createForgotPasswordDto: CreateForgotPasswordDto) {
        const forgotPassword = await this.forgotPasswordModel.create({
            email: createForgotPasswordDto.email,
            verification: v4(),
            expires: addHours(new Date(), this.HOURS_TO_VERIFY),
            ip: this.authService.getIp(req),
            browser: this.authService.getBrowserInfo(req),
            country: this.authService.getCountry(req),
        });
        await forgotPassword.save();
    }

    private async findForgotPasswordByUuid(verifyUuidDto: VerifyUuidDto): Promise<ForgotPassword> {
        const forgotPassword = await this.forgotPasswordModel.findOne({
            verification: verifyUuidDto.verification,
            firstUsed: false,
            finalUsed: false,
            expires: { $gt: new Date() },
        });
        if (!forgotPassword) {
            throw new BadRequestException('Bad request.');
        }
        return forgotPassword;
    }

    private async setForgotPasswordFirstUsed(req: Request, forgotPassword: ForgotPassword) {
        forgotPassword.firstUsed = true;
        forgotPassword.ipChanged = this.authService.getIp(req);
        forgotPassword.browserChanged = this.authService.getBrowserInfo(req);
        forgotPassword.countryChanged = this.authService.getCountry(req);
        await forgotPassword.save();
    }

    private async findForgotPasswordByEmail(resetPasswordDto: ResetPasswordDto): Promise<ForgotPassword> {
        const forgotPassword = await this.forgotPasswordModel.findOne({
            email: resetPasswordDto.email,
            firstUsed: true,
            finalUsed: false,
            expires: { $gt: new Date() },
        });
        if (!forgotPassword) {
            throw new BadRequestException('Bad request.');
        }
        return forgotPassword;
    }

    private async setForgotPasswordFinalUsed(forgotPassword: ForgotPassword) {
        forgotPassword.finalUsed = true;
        await forgotPassword.save();
    }

    private async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
        const user = await this.userModel.findOne({
            email: resetPasswordDto.email,
            verified: true,
        });
        user.password = resetPasswordDto.password;
        await user.save();
    }

}
