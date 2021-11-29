import { Roles } from './../auth/decorators/roles.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Res, Param, NotFoundException, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUuidDto } from './dto/verify-uuid.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import {
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiUnauthorizedResponse,
    ApiOkResponse,
    ApiForbiddenResponse,
    //ApiUseTags,
    } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResponseSuccess, ResponseError } from './dto/response.dto';
import { userUpdateDto } from './dto/userUpdate.dto';

//@ApiUseTags('User')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
        ) {}

    
    //AUTENTICACION
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({description: 'The record has been successfully created.'})
    @ApiBadRequestResponse({description: 'email address most be unique.'})
    @ApiBadRequestResponse({description: 'Data validation failed or Bad request..'})
    async register(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto)
        try {
        await this.userService.create(createUserDto);  
        var sent = await this.userService.sendEmailVerification(createUserDto.email);
      if(sent){
        return new ResponseSuccess("REGISTRATION.USER_REGISTERED_SUCCESSFULLY");
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch(error){
      return new ResponseError("REGISTRATION.ERROR.GENERIC_ERROR", error);
    }
  }
    

    /* @Post('api-verify-email')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'User has been successfully verified.'})
    @ApiBadRequestResponse({description: 'Data validation failed or Bad request..'})
    async verifyEmail(@Req() req: Request, @Body() verifyUuidDto: VerifyUuidDto) {
        return await this.userService.verifyEmail(req, verifyUuidDto);
    }
 */

    @Get('api-verify-email/:verifyUuidDto')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'User has been successfully verified.'})
    @ApiBadRequestResponse({description: 'Data validation failed or Bad request..'})
    async verifyEmail(@Res() res, @Req() req: Request, @Param('verifyUuidDto') verifyUuidDto) {
        const user = await this.userService.verifyEmail(req, verifyUuidDto);
        if (!user) throw new NotFoundException('Error Al verificar email')
        return res.status(HttpStatus.OK).redirect('https://???/iniciarsesion')
    }


    @Post('LogIn')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'User has been successfully logged in and tokens generated.'})
    @ApiNotFoundResponse({description: 'User not found wrong email or password.'})
    @ApiConflictResponse({description: 'User blocked try later.'})
    @ApiBadRequestResponse({description: 'Data validation failed or Bad request.'})
    async login(@Req() req: Request, @Body() loginUserDto: LoginUserDto) {
        return await this.userService.login(req, loginUserDto);
    }

    @Post('refresh-access-token')
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({description: 'Access token has been generated successfully.'})
    @ApiUnauthorizedResponse({description: 'User has been Logged out.'})
    @ApiBadRequestResponse({description: 'Data validation failed or Bad request.'})
    async refreshAccessToken(@Body() refreshAccessTokenDto: RefreshAccessTokenDto) {
        return await this.userService.refreshAccessToken(refreshAccessTokenDto);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'Verification has been sent.'})
    @ApiNotFoundResponse({description: 'User not found.'})
    @ApiBadRequestResponse({description: 'Data validation failed or Bad request.'})
    async forgotPassword(@Req() req: Request, @Body() createForgotPasswordDto: CreateForgotPasswordDto) {
        return await this.userService.forgotPassword(req, createForgotPasswordDto);
    }

    @Post('forgot-password-verify')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'Now user can reset his/her password.'})
    @ApiBadRequestResponse({description: 'Data validation failed or Bad request.'})
    async forgotPasswordVerify(@Req() req: Request, @Body() verifyUuidDto: VerifyUuidDto) {
        return await this.userService.forgotPasswordVerify(req, verifyUuidDto);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'Password has been successfully changed.'})
    @ApiBadRequestResponse({description: 'Data validation failed or Bad request.'})
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.userService.resetPassword(resetPasswordDto);
    }

    @Get('data')
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({description: 'Data recieved'})
    @ApiUnauthorizedResponse({ description: 'Not authorized.'})
    @ApiForbiddenResponse({description: 'User has not permitted to this api.'})
    findAll() {
        return this.userService.findAll();
    }

    //@Roles('admin')
    @Get('/getUsers')
    async getProducts(@Res() res) {
        const users = await this.userService.getUsers();
        return res.status(HttpStatus.OK).json(users);
    }

    @Put('updateUser')
    async updateUser(@Res() res, @Body() userUpdateDTO: userUpdateDto, @Query('email') email){
       const updateUser = await this.userService.upDateUser(email, userUpdateDTO);
       if (!updateUser) throw new NotFoundException('Error al actualizar usuario')
       return res.status(HttpStatus.OK).json({
           message: "Usuario updated Successfully",
           updateUser
       });
       
    }
}
