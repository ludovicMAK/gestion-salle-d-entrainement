import { Types } from 'mongoose';

export interface Address {
    _id?: Types.ObjectId;
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
    createdAt?: Date;
    updatedAt?: Date;
}
