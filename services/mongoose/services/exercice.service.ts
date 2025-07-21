import { Model, Types } from "mongoose";
import { Exercice, NiveauExercice } from "../../../models";

export class ExerciceService {
    constructor(private exerciceModel: Model<Exercice>) {}

    async create(exerciceData: Partial<Exercice>): Promise<Exercice> {
        const exercice = new this.exerciceModel(exerciceData);
        return await exercice.save();
    }

    async findById(id: string | Types.ObjectId): Promise<Exercice | null> {
        return await this.exerciceModel.findById(id)
            .populate('typeExercice', 'nom description')
            .exec();
    }

    async findAll(filter: Partial<Exercice> = {}): Promise<Exercice[]> {
        return await this.exerciceModel.find(filter)
            .populate('typeExercice', 'nom description')
            .exec();
    }

    async findByType(typeExerciceId: string | Types.ObjectId): Promise<Exercice[]> {
        return await this.exerciceModel.find({ typeExercice: typeExerciceId, actif: true })
            .populate('typeExercice', 'nom description')
            .exec();
    }

    async findByNiveau(niveau: NiveauExercice): Promise<Exercice[]> {
        return await this.exerciceModel.find({ niveau, actif: true })
            .populate('typeExercice', 'nom description')
            .exec();
    }

    async findByMuscles(musclesCibles: string[]): Promise<Exercice[]> {
        return await this.exerciceModel.find({
            musclesCibles: { $in: musclesCibles },
            actif: true
        })
        .populate('typeExercice', 'nom description')
        .exec();
    }

    async findByEquipments(equipements: string[]): Promise<Exercice[]> {
        return await this.exerciceModel.find({
            equipements: { $in: equipements },
            actif: true
        })
        .populate('typeExercice', 'nom description')
        .exec();
    }

    async update(id: string | Types.ObjectId, updateData: Partial<Exercice>): Promise<Exercice | null> {
        return await this.exerciceModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('typeExercice', 'nom description')
            .exec();
    }

    async delete(id: string | Types.ObjectId): Promise<Exercice | null> {
        return await this.exerciceModel.findByIdAndDelete(id).exec();
    }

    async activate(id: string | Types.ObjectId): Promise<Exercice | null> {
        return await this.update(id, { actif: true });
    }

    async deactivate(id: string | Types.ObjectId): Promise<Exercice | null> {
        return await this.update(id, { actif: false });
    }
}
