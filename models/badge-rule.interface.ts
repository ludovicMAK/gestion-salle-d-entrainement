import { Types } from 'mongoose';
import { Timestamps } from './timestamps';

export interface BadgeRuleCondition {
    type: 'DEFI_COMPLETION' | 'REPETITIONS' | 'CONSECUTIVE_DAYS' | 'SCORE_THRESHOLD' | 'DIFFICULTY_LEVEL' | 'GYM_SPECIFIC';
    value: number;
    timeframe?: number;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    gymId?: Types.ObjectId;
}

export interface BadgeRule extends Timestamps {
    _id?: Types.ObjectId;
    name: string;
    description: string;
    badge: Types.ObjectId;
    conditions: BadgeRuleCondition[];
    points: number;
    isActive: boolean;
    category?: string;
    order?: number;
} 