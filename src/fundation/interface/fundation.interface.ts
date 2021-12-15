import { Document } from 'mongoose';

export interface Fundation extends Document {
    name: string;
    web: string;
    provincia: string;
    adress: string;
    tel: number;
    loc: string;
    description: string;
}