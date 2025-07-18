import { Model, Types } from "mongoose";
import { Badge } from "../../../models";
export class BadgeService {
    constructor(private badgeModel: Model<Badge>) {}

    async create(badgeData: Partial<Badge>): Promise<Badge> {
        const badge = new this.badgeModel(badgeData);
        return await badge.save();
    }

    async findById(id: string | Types.ObjectId): Promise<Badge | null> {
        return await this.badgeModel.findById(id).exec();
    }

    async findAll(): Promise<Badge[]> {
        return await this.badgeModel.find().exec();
    }

    async findByName(nom: string): Promise<Badge | null> {
        return await this.badgeModel.findOne({ nom }).exec();
    }

    async update(id: string | Types.ObjectId, updateData: Partial<Badge>): Promise<Badge | null> {
        return await this.badgeModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string | Types.ObjectId): Promise<Badge | null> {
        return await this.badgeModel.findByIdAndDelete(id).exec();
    }

    async findByPoints(minPoints: number): Promise<Badge[]> {
        return await this.badgeModel.find({ points: { $gte: minPoints } }).exec();
    }
}
