import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { AuthModule } from '.././auth/auth.module';
import { ForgotPasswordSchema } from './schemas/forgot-password.schema';
import { EmailVerificationSchema } from './schemas/emailverification.schema';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'ForgotPassword', schema: ForgotPasswordSchema}]),
    MongooseModule.forFeature([{ name: 'EmailVerification', schema: EmailVerificationSchema}]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
