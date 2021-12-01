import { Document } from 'mongoose';

export interface User extends Document {
    
    readonly name: string;
    readonly fullName?: string;
    readonly email: string;
    readonly imgURL: string;
    password: string;
    readonly donaciones?: number;
    readonly premios?: number;
    readonly socilMedia?: [String];
    readonly roles: [string];

    //if user is fundation
    readonly webURL?: string;
    readonly provincia?: string;
    readonly loc?: string;
    readonly adress?: string;
    readonly tel?: [number];

    readonly verification: string;
    readonly verified: boolean;
    readonly verificationExpires: Date;
    readonly loginAttempts?: number;
    readonly blockExpires?: Date;
    readonly bankAccountNumber?: string;
    readonly bankAccountName?: string;
}
