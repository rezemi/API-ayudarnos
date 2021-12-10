import * as mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const CaseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imgURL: {
        type: String,
        required: false
    },
    cbu: {
        type: String,
        required: true
    },
    alias: {
        type: String,
        required: true
    },
    cuil: {
        type: String,
        required: true
    },
    expectedMoney: {
        type: Number,
        required: true
    },

    moneyCollected: {
        type: Number,
        required: false
    },
    countDonate: {
        type: Number,
        required: false
    },
    finished: {
        type: Boolean,
        required: false,
        default: false,
    },
})