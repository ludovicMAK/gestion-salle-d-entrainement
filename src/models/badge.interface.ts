import { Types } from 'mongoose';

export interface Badge {
    _id?: Types.ObjectId;
    nom: string;
    description: string;
    icone: string;
    condition: string;
    points: number;
    createdAt?: Date;
    updatedAt?: Date;
}
