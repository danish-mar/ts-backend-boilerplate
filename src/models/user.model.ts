import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { Role } from '../interfaces/auth.interface.js';

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            private: true, // used by toJSON plugin
        },
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.USER,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                const result = ret as any;
                delete result.password;
                delete result.__v;
                result.id = result._id;
                delete result._id;
                return result;
            },
        },
    }
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);
