import { Types } from 'mongoose';
import { Timestamps } from './timestamps';

export interface Badge extends Timestamps {
    _id?: Types.ObjectId;
    nom: string;
    description: string;
    icone: string;
    points: number;
    category?: string; 
}
