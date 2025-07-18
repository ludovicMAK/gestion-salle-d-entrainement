import { Model, Types } from "mongoose";
import { Defi, DifficulteDefi, StatutDefi } from "../../../models";

export class DefiService {
    constructor(private defiModel: Model<Defi>) {}

    async create(defiData: Partial<Defi>): Promise<Defi> {
        const defi = new this.defiModel(defiData);
        return await defi.save();
    }

    async findById(id: string | Types.ObjectId): Promise<Defi | null> {
        return await this.defiModel.findById(id)
            .populate('exercices', 'nom description niveau')
            .populate('salle', 'nom adresse')
            .populate('createur', 'nom email')
            .populate('participants', 'nom email score')
            .exec();
    }

    async findAll(filter: Partial<Defi> = {}): Promise<Defi[]> {
        return await this.defiModel.find(filter)
            .populate('exercices', 'nom description niveau')
            .populate('salle', 'nom adresse')
            .populate('createur', 'nom email')
            .populate('participants', 'nom email score')
            .exec();
    }

    async findByCreator(createurId: string | Types.ObjectId): Promise<Defi[]> {
        return await this.defiModel.find({ createur: createurId })
            .populate('exercices', 'nom description niveau')
            .populate('salle', 'nom adresse')
            .populate('participants', 'nom email score')
            .exec();
    }

    async findBySalle(salleId: string | Types.ObjectId): Promise<Defi[]> {
        return await this.defiModel.find({ salle: salleId, statut: StatutDefi.ACTIF })
            .populate('exercices', 'nom description niveau')
            .populate('createur', 'nom email')
            .populate('participants', 'nom email score')
            .exec();
    }

    async findByDifficulte(difficulte: DifficulteDefi): Promise<Defi[]> {
        return await this.defiModel.find({ difficulte, statut: StatutDefi.ACTIF })
            .populate('exercices', 'nom description niveau')
            .populate('salle', 'nom adresse')
            .populate('createur', 'nom email')
            .populate('participants', 'nom email score')
            .exec();
    }

    async joinDefi(defiId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<Defi | null> {
        return await this.defiModel.findByIdAndUpdate(
            defiId,
            { $addToSet: { participants: userId } },
            { new: true }
        )
        .populate('exercices', 'nom description niveau')
        .populate('salle', 'nom adresse')
        .populate('createur', 'nom email')
        .populate('participants', 'nom email score')
        .exec();
    }

    async leaveDefi(defiId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<Defi | null> {
        return await this.defiModel.findByIdAndUpdate(
            defiId,
            { $pull: { participants: userId } },
            { new: true }
        )
        .populate('exercices', 'nom description niveau')
        .populate('salle', 'nom adresse')
        .populate('createur', 'nom email')
        .populate('participants', 'nom email score')
        .exec();
    }

    async update(id: string | Types.ObjectId, updateData: Partial<Defi>): Promise<Defi | null> {
        return await this.defiModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('exercices', 'nom description niveau')
            .populate('salle', 'nom adresse')
            .populate('createur', 'nom email')
            .populate('participants', 'nom email score')
            .exec();
    }

    async delete(id: string | Types.ObjectId): Promise<Defi | null> {
        return await this.defiModel.findByIdAndDelete(id).exec();
    }

    async terminate(id: string | Types.ObjectId): Promise<Defi | null> {
        return await this.update(id, { statut: StatutDefi.TERMINE });
    }

    async updateStatus(id: string | Types.ObjectId, statut: StatutDefi): Promise<Defi | null> {
        return await this.update(id, { statut });
    }
}
