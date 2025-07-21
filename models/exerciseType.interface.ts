import { Timestamps } from './timestamps';
import { MuscleGroup } from './muscleGroups';

export interface ExerciseType extends Timestamps {
    _id: number;
    name: string;
    description?: string;
    muscleGroups: MuscleGroup[]; // ex: [MuscleGroup.Chest, MuscleGroup.Abs]
}
