import { Types } from 'mongoose';
import { Timestamps } from './timestamps';
import { User } from './user.interface';
import { ExerciseType } from './exerciseType.interface';

export interface TrainingExercise {
    exercise: Types.ObjectId | ExerciseType;  
    repetitions: number;                      
    sets: number;                            
}

export interface TrainingSheet extends Timestamps {
    _id?: Types.ObjectId;
    name: string;                            
    description?: string;                    
    user: Types.ObjectId | User;             
    exercises: TrainingExercise[];           
}

export type CreateTrainingSheet = Omit<TrainingSheet, '_id' | 'createdAt' | 'updatedAt'>; 