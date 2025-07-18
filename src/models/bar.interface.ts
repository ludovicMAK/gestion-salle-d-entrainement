import { Types } from 'mongoose';
import { Address } from './address.interface';

export interface Bar {
    _id?: Types.ObjectId;
    name: string;
    address: Address;
    phone?: string;
    owner: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
