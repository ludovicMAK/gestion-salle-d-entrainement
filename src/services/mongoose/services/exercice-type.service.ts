import { Model, Types } from "mongoose";
import { ExerciceType } from "../../../models";

export class ExerciceTypeService {
    constructor(private exerciceTypeModel: Model<ExerciceType>) {}

    async create(exerciceTypeData: Partial<ExerciceType>): Promise<ExerciceType> {
        const exerciceType = new this.exerciceTypeModel(exerciceTypeData);
        return await exerciceType.save();
    }

    async findById(id: string | Types.ObjectId): Promise<ExerciceType | null> {
        return await this.exerciceTypeModel.findById(id).exec();
    }

    async findAll(): Promise<ExerciceType[]> {
        return await this.exerciceTypeModel.find().exec();
    }

    async findByName(nom: string): Promise<ExerciceType | null> {
        return await this.exerciceTypeModel.findOne({ nom }).exec();
    }

    async update(id: string | Types.ObjectId, updateData: Partial<ExerciceType>): Promise<ExerciceType | null> {
        return await this.exerciceTypeModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string | Types.ObjectId): Promise<ExerciceType | null> {
        return await this.exerciceTypeModel.findByIdAndDelete(id).exec();
    }
}
