import { Document } from 'mongoose';

export interface Case extends Document{
    readonly title: string;
    readonly subTitle: string;
    readonly description: string;
    readonly imgURL?: string;
    readonly cbu: string;
    readonly alias: string;
    readonly cuil: string;
    readonly expectedMoney: number;

    readonly moneyCollected: number;
    readonly countDonate: number;
    readonly finished: boolean;

}