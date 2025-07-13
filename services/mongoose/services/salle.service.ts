import { Model, Types } from "mongoose";
import { Salle } from "../../../models";

export class SalleService {
    constructor(private salleModel: Model<Salle>) {}

    async create(salleData: Partial<Salle>): Promise<Salle> {
        const salle = new this.salleModel(salleData);
        return await salle.save();
    }

    async findById(id: string | Types.ObjectId): Promise<Salle | null> {
        return await this.salleModel.findById(id)
            .populate('owner', 'nom email')
            .populate('typesExercices', 'nom description')
            .exec();
    }

    async findAll(filter: Partial<Salle> = {}): Promise<Salle[]> {
        return await this.salleModel.find(filter)
            .populate('owner', 'nom email')
            .populate('typesExercices', 'nom description')
            .exec();
    }

    async findByOwner(ownerId: string | Types.ObjectId): Promise<Salle[]> {
        return await this.salleModel.find({ owner: ownerId })
            .populate('typesExercices', 'nom description')
            .exec();
    }

    async findApproved(): Promise<Salle[]> {
        return await this.salleModel.find({ approuvee: true })
            .populate('owner', 'nom email')
            .populate('typesExercices', 'nom description')
            .exec();
    }

    async update(id: string | Types.ObjectId, updateData: Partial<Salle>): Promise<Salle | null> {
        return await this.salleModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('owner', 'nom email')
            .populate('typesExercices', 'nom description')
            .exec();
    }

    async delete(id: string | Types.ObjectId): Promise<Salle | null> {
        return await this.salleModel.findByIdAndDelete(id).exec();
    }

    async approve(id: string | Types.ObjectId): Promise<Salle | null> {
        return await this.update(id, { approuvee: true });
    }

    async searchByEquipments(equipements: string[]): Promise<Salle[]> {
        return await this.salleModel.find({
            equipements: { $in: equipements },
            approuvee: true
        })
        .populate('owner', 'nom email')
        .populate('typesExercices', 'nom description')
        .exec();
    }
}
