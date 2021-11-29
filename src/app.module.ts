import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryProvider } from './cloudinary/cloudinary';
import { CasenModule } from './case/case.module';
require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }),
    AuthModule,
    UserModule,
    CloudinaryModule,
    CasenModule],
  controllers: [AppController],
  providers: [AppService, CloudinaryProvider],
})
export class AppModule {}
