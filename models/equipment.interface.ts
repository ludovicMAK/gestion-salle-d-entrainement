import { Types } from 'mongoose';
import { Timestamps } from "./timestamps";
import { MuscleGroup } from "./muscleGroups";
import { User } from "./user.interface";

export interface Equipment extends Timestamps {
    _id: string;
    name: string;
    description?: string;
    muscleGroups: MuscleGroup[];
    owner: User | Types.ObjectId;
    gym?: Types.ObjectId;
}
