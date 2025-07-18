import { Types } from 'mongoose';
import { User } from './user.interface';

export interface Session {
    _id?: Types.ObjectId;
    user: Types.ObjectId | User;
    expirationDate: Date;
    // Compatibility fields
    userId?: Types.ObjectId;
    token?: string;
    expiresAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
