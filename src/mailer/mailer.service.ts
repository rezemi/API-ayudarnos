import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { default as config } from '../config';
import { MailOptions } from './interface/mailOptions';

@Injectable()
export class MailerService {

    mailOption = <MailOptions>{};

    constructor() {}

    public async createTransport(options: MailOptions) {

        this.mailOption = {
            from: '"Ayudarnos" <' + config.mail.user + '>',
            to: options.to, // list of receivers (separated by ,)
            subject: options.subject,  // list of receivers (separated by ,)
            text: options.text, 
            html: options.html
        }

        const transporter = nodemailer.createTransport({
            host: config.mail.host,
            port: config.mail.port,
            secure: config.mail.secure,     // true for 465, false for other ports
            requireTLS: true,
            secureConnection: false,
            auth: {
                user: config.mail.user,
                pass: config.mail.pass
            }
        });
        const sent = transporter.sendMail(this.mailOption);
        return sent;
    }

}
