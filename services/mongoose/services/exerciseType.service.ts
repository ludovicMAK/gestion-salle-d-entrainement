import { Model,  Mongoose,isValidObjectId} from "mongoose";
import {ExerciseType } from "../../../models";
import { exerciseTypeSchema } from "../schema/exerciseType.schema";

export type createExerciseType = Omit<ExerciseType, '_id' | 'createdAt' | 'updatedAt'>;
export class ExerciseTypeService {
    readonly exerciseTypeModel: Model<ExerciseType>;

    constructor(public readonly connection: Mongoose) {
        // Check if model already exists to avoid overwrite error
        this.exerciseTypeModel = connection.models.ExerciseType || connection.model('ExerciseType', exerciseTypeSchema());
    }

    async create(exerciseTypeData: createExerciseType): Promise<ExerciseType> {
        console.log(exerciseTypeData, "Creating new exercise type");
        const exerciseType = new this.exerciseTypeModel(exerciseTypeData);
        return await exerciseType.save();
    }
    async getAll(): Promise<ExerciseType[]> {
        return this.exerciseTypeModel.find().sort({ createdAt: -1 });
    }
    async getById(id: string): Promise<ExerciseType | null> {
        if (!isValidObjectId(id)) {
            return null;
        }
        return this.exerciseTypeModel.findById(id);
    }
    async update(id: string, updateData: Partial<createExerciseType>): Promise<ExerciseType | null> {
        if (!isValidObjectId(id)) {
            return null;
        }
        return this.exerciseTypeModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    async delete(id: string): Promise<ExerciseType | null> {
        if (!isValidObjectId(id)) {
            return null;
        }
        return this.exerciseTypeModel.findByIdAndDelete(id);
    }
    

}
