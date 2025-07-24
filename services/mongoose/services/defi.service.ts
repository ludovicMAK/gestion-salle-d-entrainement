import { Model, Types, Mongoose } from "mongoose";
import { Defi } from "../../../models";
import { defiSchema } from "../schema";

export class DefiService {
    readonly defiModel: Model<Defi>;

    constructor(public readonly connection: Mongoose) {
        this.defiModel = connection.models.Defi || connection.model('Defi', defiSchema());
    }

    async create(defiData: Partial<Defi>): Promise<Defi> {
        const defi = new this.defiModel(defiData);
        return await defi.save();
    }

    async findById(id: string | Types.ObjectId): Promise<Defi | null> {
        return await this.defiModel.findById(id)
            .populate('exercise')
            .populate('creator', 'firstName lastName email')
            .populate('badges')
            .populate('gym', 'name')
            .populate('recommendedEquipment')
            .exec();
    }

    async findAll(): Promise<Defi[]> {
        return await this.defiModel.find()
            .populate('exercise')
            .populate('creator', 'firstName lastName email')
            .populate('badges')
            .populate('gym', 'name')
            .populate('recommendedEquipment')
            .exec();
    }

    async findByType(type: 'SOCIAL' | 'GYM'): Promise<Defi[]> {
        return await this.defiModel.find({ type })
            .populate('exercise')
            .populate('creator', 'firstName lastName email')
            .populate('badges')
            .populate('gym', 'name')
            .populate('recommendedEquipment')
            .exec();
    }

    async findByCreator(creatorId: string | Types.ObjectId): Promise<Defi[]> {
        return await this.defiModel.find({ creator: creatorId })
            .populate('exercise')
            .populate('badges')
            .populate('gym', 'name')
            .populate('recommendedEquipment')
            .exec();
    }

    async findByGym(gymId: string | Types.ObjectId): Promise<Defi[]> {
        return await this.defiModel.find({ gym: gymId })
            .populate('exercise')
            .populate('creator', 'firstName lastName email')
            .populate('badges')
            .populate('recommendedEquipment')
            .exec();
    }

    async findByDifficulty(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): Promise<Defi[]> {
        return await this.defiModel.find({ difficulty })
            .populate('exercise')
            .populate('creator', 'firstName lastName email')
            .populate('badges')
            .populate('gym', 'name')
            .populate('recommendedEquipment')
            .exec();
    }

    async update(id: string | Types.ObjectId, updateData: Partial<Defi>): Promise<Defi | null> {
        return await this.defiModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('exercise')
            .populate('creator', 'firstName lastName email')
            .populate('badges')
            .populate('gym', 'name')
            .populate('recommendedEquipment')
            .exec();
    }

    async delete(id: string | Types.ObjectId): Promise<Defi | null> {
        return await this.defiModel.findByIdAndDelete(id).exec();
    }

    async findPublicDefis(): Promise<Defi[]> {
        return await this.defiModel.find({ type: 'SOCIAL' })
            .populate('exercise')
            .populate('creator', 'firstName lastName email')
            .populate('badges')
            .populate('recommendedEquipment')
            .exec();
    }
} 