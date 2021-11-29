import { Injectable, Inject } from '@nestjs/common';
import { Cloudinary } from './cloudinary';
@Injectable()
export class CloudinaryService {
  private v2: any
  constructor(
     @Inject(Cloudinary)
     private cloudinary
  ){
     this.cloudinary.v2.config({
       cloud_name: process.env.CLOUDINARY_NAME,
       api_key: process.env.CLOUDINARY_KEY,
       api_secret: process.env.CLOUDINARY_SECRET_KEY
     })
    this.v2 = cloudinary.v2
  }
  async upload(file:any){
    return await this.v2.uploader.upload(file)
  }
}
