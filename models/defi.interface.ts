import { Types } from 'mongoose';
import { Timestamps } from './timestamps';

export interface Defi extends Timestamps {
    _id?: Types.ObjectId;
    exercise: Types.ObjectId;
    numberOfRepetitions: number;
    creator: Types.ObjectId;
    badges: Types.ObjectId[];
    name: string;
    description?: string;
    type: 'SOCIAL' | 'GYM';
    gym?: Types.ObjectId;
    durationDays?: number; 
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    recommendedEquipment: Types.ObjectId[];
} 