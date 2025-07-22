import {Mongoose, Model, FilterQuery, isValidObjectId} from "mongoose";
import { User, UserRole } from "../../../models";
import {userSchema} from "../schema";
import {sha256} from "../../../utils";
import { Equipment } from "../../../models/equipment.interface";
import { equipmentSchema } from "../schema/equipment.schema";

// omit permet d'enlever des clés d'un type pour en créer un nouveau
export type CreateEquipment = Omit<Equipment, '_id' | 'createdAt' | 'updatedAt'>;

export class EquipmentService {

    readonly equipmentModel: Model<Equipment>;

    constructor(public readonly connection: Mongoose) {
        // Check if model already exists to avoid overwrite error
        this.equipmentModel = connection.models.Equipment || connection.model('Equipment', equipmentSchema());
    }
    async createEquipment(equipment: CreateEquipment): Promise<Equipment> {
        return this.equipmentModel.create(equipment);
    }
    async updateEquipment(id: string, updateData: Partial<CreateEquipment>): Promise<Equipment | null> {
        if (!isValidObjectId(id)) {
            return null;
        }
        return this.equipmentModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    async deleteEquipment(id: string): Promise<Equipment | null> {
        if (!isValidObjectId(id)) {
            return null;
        }
        return this.equipmentModel.findByIdAndDelete(id);
    }
    async getEquipments(): Promise<Equipment[]> {
        return this.equipmentModel.find().sort({ createdAt: -1 });
    }
    async getEquipmentById(id: string): Promise<Equipment | null> {
        if (!isValidObjectId(id)) {
            return null;
        }
        return this.equipmentModel.findById(id)
            .populate('muscleGroups', 'name description');
    }
}