import { Types } from 'mongoose';
import { Timestamps } from './timestamps';

export interface DefiSuivi extends Timestamps {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    defi: Types.ObjectId;
    status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'ABANDONED';
    startDate: Date;
    endDate?: Date;
    currentRepetitions: number;
    targetRepetitions: number;
    progressPercentage: number; 
    pointsEarned?: number;
    badgesEarned: Types.ObjectId[];
    notes?: string;
    lastActivity?: Date;
} 