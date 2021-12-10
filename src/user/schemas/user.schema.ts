import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import validator from 'validator';

export const UserSchema = new mongoose.Schema ({
    name: {
        type: String,
        minLength: 6,
      maxLength: 255,
      required: [false, 'NAME_IS_BLANK'],
    },
    donaciones: {
      type: Number,
      required: [true, 'NAME_IS_BLANK'],
      default: 0
    },
    imgURL: {
      type: String,
      required: [false, 'NAME_IS_BLANK'],
      default: 'https://res.cloudinary.com/dg0jfxuoc/image/upload/v1638571962/profile-default_iej5xe.png'
    },
    premios: {
      type: Number,
      required: [true, 'NAME_IS_BLANK'],
      default: 0
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
    fullName: {
        type: String,
        minlength: 6,
        maxlength: 255,
        required: [false, 'NAME_IS_BLANK'],
    },
    email: {
        type: String,
        lowercase: true,
        validate: validator.isEmail,
        maxlength: 255,
        minlength: 6,
        required: [true, 'EMAIL_IS_BLANK'],
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
        default: ['user'],
    },
    verification: {
        type: String,
        validate: validator.isUUID,
    },
    verified: {
        type: Boolean,
        default: false,
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

UserSchema.pre('save', async function(next) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
      // tslint:disable-next-line:no-string-literal
      const hashed = await bcrypt.hash(this['password'], 10);
      // tslint:disable-next-line:no-string-literal
      this['password'] = hashed;
      return next();
    } catch (err) {
      return next(err);
    }
  });
