import { Mongoose, Model, isValidObjectId } from "mongoose";
import { Equipment } from "../../../models/equipment.interface";
import { equipmentSchema } from "../schema/equipment.schema";

export type CreateEquipment = Omit<Equipment, '_id' | 'createdAt' | 'updatedAt'>;

export class EquipmentService {
    readonly equipmentModel: Model<Equipment>;

    constructor(public readonly connection: Mongoose) {
        this.equipmentModel = connection.models.Equipment || connection.model('Equipment', equipmentSchema());
    }

    async create(equipment: CreateEquipment): Promise<Equipment> {
        return this.equipmentModel.create(equipment);
    }

    async findById(id: string): Promise<Equipment | null> {
        if (!isValidObjectId(id)) {
            return null;
        }
        return this.equipmentModel.findById(id)
            .populate('owner', 'firstName lastName email')
            .populate('gym', 'name address');
    }

    async findAll(): Promise<Equipment[]> {
        return this.equipmentModel.find()
            .populate('owner', 'firstName lastName email')
            .populate('gym', 'name address')
            .sort({ createdAt: -1 });
    }

    async findByOwner(ownerId: string): Promise<Equipment[]> {
        return this.equipmentModel.find({ owner: ownerId })
            .populate('gym', 'name address')
            .sort({ createdAt: -1 });
    }

    async findByGym(gymId: string): Promise<Equipment[]> {
        return this.equipmentModel.find({ gym: gymId })
            .populate('owner', 'firstName lastName email')
            .sort({ createdAt: -1 });
    }

    async update(id: string, updateData: Partial<CreateEquipment>): Promise<Equipment | null> {
        if (!isValidObjectId(id)) {
            return null;
        }
        return this.equipmentModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('owner', 'firstName lastName email')
            .populate('gym', 'name address');
    }

    async delete(id: string): Promise<Equipment | null> {
        if (!isValidObjectId(id)) {
            return null;
        }
        return this.equipmentModel.findByIdAndDelete(id);
    }
}