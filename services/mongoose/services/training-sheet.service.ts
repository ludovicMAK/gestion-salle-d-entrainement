import { Model, Mongoose, isValidObjectId } from "mongoose";
import { TrainingSheet, CreateTrainingSheet } from "../../../models";
import { trainingSheetSchema } from "../schema/training-sheet.schema";

export class TrainingSheetService {
    readonly trainingSheetModel: Model<TrainingSheet>;

    constructor(public readonly connection: Mongoose) {
        this.trainingSheetModel = connection.models.TrainingSheet || connection.model('TrainingSheet', trainingSheetSchema());
    }

    async create(sheetData: CreateTrainingSheet): Promise<TrainingSheet> {
        return this.trainingSheetModel.create(sheetData);
    }

    async findById(id: string): Promise<TrainingSheet | null> {
        if (!isValidObjectId(id)) {
            return null;
        }
        return this.trainingSheetModel.findById(id)
            .populate('exercises.exercise', 'name description muscleGroups')
            .exec();
    }

    async findByUser(userId: string): Promise<TrainingSheet[]> {
        if (!isValidObjectId(userId)) {
            return [];
        }

        return this.trainingSheetModel.find({ user: userId })
            .populate('exercises.exercise', 'name description muscleGroups')
            .sort({ createdAt: -1 })
            .exec();
    }

    async update(id: string, updateData: Partial<CreateTrainingSheet>): Promise<TrainingSheet | null> {
        if (!isValidObjectId(id)) {
            return null;
        }

        return this.trainingSheetModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('exercises.exercise', 'name description muscleGroups')
            .exec();
    }

    async delete(id: string): Promise<TrainingSheet | null> {
        if (!isValidObjectId(id)) {
            return null;
        }
        return this.trainingSheetModel.findByIdAndDelete(id).exec();
    }


} 