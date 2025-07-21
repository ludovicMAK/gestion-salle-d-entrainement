import { Timestamps } from "./timestamps";
import { MuscleGroup } from "./muscleGroups";
export interface Equipment extends Timestamps{
    _id: string;
    name: string;
    description?: string;
    muscleGroups: MuscleGroup[];
}
