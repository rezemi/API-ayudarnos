import * as mongoose from 'mongoose';
import validator from 'validator';

export const FundationSchema = new mongoose.Schema ({
    name: {
        type: String,
        minLength: 6,
      maxLength: 255,
      required: [false, 'NAME_IS_BLANK'],
    },

    imgURL: {
      type: String,
      required: [false, 'NAME_IS_BLANK'],
      default: 'https://res.cloudinary.com/dg0jfxuoc/image/upload/v1638571962/profile-default_iej5xe.png'
    },
 
    socialMedia: {
      type: [String],
      required: [false, 'NAME_IS_BLANK'],
    },
    adress: {
        type: String,
        minLength: 6,
      maxLength: 255,
      required: [false, 'NAME_IS_BLANK'],
    },
    loc: {
        type: String,
        minLength: 6,
      maxLength: 255,
      required: [false, 'NAME_IS_BLANK'],
    },
    tel: {
      type: Number,
      maxLength: 15,
      required: [false, 'NAME_IS_BLANK'],
    },

    email: {
        type: String,
        lowercase: true,
        validate: validator.isEmail,
        maxlength: 255,
        minlength: 6,
        required: [false, 'EMAIL_IS_BLANK'],
    },

    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: [false, 'PASSWORD_IS_BLANK'],
    },
    bankAccountNumber: {
        type: String,
        maxlength: 32,
    },
    bankAccountOwnerName: {
        type: String,
        minlength: 6,
        maxlength: 255,
    },
    roles: {
        type: [String],
        default: ['fundation'],
    },

    verified: {
        type: Boolean,
        default: true,
    },
    verificationExpires: {
        type: Date,
        default: Date.now,
    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
    blockExpires: {
      type: Date,
      default: Date.now,
    },
}, {
    versionKey: false,
    timestamps: true,
});