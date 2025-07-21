import { Model, Types,Mongoose } from "mongoose";
import { gymSchema } from "../schema";
import { Gym } from "../../../models";

export class GymService {
    readonly gymModel: Model<Gym>;

    constructor(public readonly connection: Mongoose) {
        this.gymModel = connection.model('Gym', gymSchema());
    }

    async create(gymData: Partial<Gym>): Promise<Gym> {
        const gym = new this.gymModel(gymData);
        return await gym.save();
    }

    async findById(id: string | Types.ObjectId): Promise<Gym | null> {
        return await this.gymModel.findById(id)
            .populate('owner', 'nom email')
            .populate('typesExercices', 'nom description')
            .exec();
    }

    async findAll(filter: Partial<Gym> = {}): Promise<Gym[]> {
        return await this.gymModel.find(filter)
            .populate('owner', 'nom email')
            .populate('typesExercices', 'nom description')
            .exec();
    }

    async findByOwner(ownerId: string | Types.ObjectId): Promise<Gym[]> {
        return await this.gymModel.find({ owner: ownerId })
            .populate('typesExercices', 'nom description')
            .exec();
    }

    async findApproved(): Promise<Gym[]> {
        return await this.gymModel.find({ approuvee: true })
            .populate('owner', 'nom email')
            .populate('typesExercices', 'nom description')
            .exec();
    }

    async update(id: string | Types.ObjectId, updateData: Partial<Gym>): Promise<Gym | null> {
        return await this.gymModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('owner', 'nom email')
            .populate('typesExercices', 'nom description')
            .exec();
    }

    async delete(id: string | Types.ObjectId): Promise<Gym | null> {
        return await this.gymModel.findByIdAndDelete(id).exec();
    }

    async approve(id: string | Types.ObjectId): Promise<Gym | null> {
        return await this.update(id, { approuvee: true });
    }

    async updateApproval(id: string | Types.ObjectId, approuvee: boolean): Promise<Gym | null> {
        return await this.update(id, { approuvee });
    }

    async searchByEquipments(equipements: string[]): Promise<Gym[]> {
        return await this.gymModel.find({
            equipements: { $in: equipements },
            approuvee: true
        })
        .populate('owner', 'nom email')
        .populate('typesExercices', 'nom description')
        .exec();
    }
    
}
