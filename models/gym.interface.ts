import { Types } from 'mongoose';
import { Timestamps } from './timestamps';
import { Equipment } from './equipment.interface';
import { User } from './user.interface';
import { ExerciseType } from './exerciseType.interface';
import { DifficultyLevel } from './difficultyLevel.interface';

export interface Gym extends Timestamps {
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  capacity: number;

  equipments: Equipment[];             
  exerciseTypes: ExerciseType[];       

  difficultyLevels: DifficultyLevel[]; 
  isApproved: boolean;

  owner: User | Types.ObjectId;                        

  createdAt: Date;
  updatedAt: Date;
}