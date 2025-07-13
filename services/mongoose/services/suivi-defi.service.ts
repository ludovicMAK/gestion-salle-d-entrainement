import { Model, Types } from "mongoose";
import { SuiviDefi, ProgressionDefi } from "../../../models";

export class SuiviDefiService {
    constructor(private suiviDefiModel: Model<SuiviDefi>) {}

    async create(suiviData: Partial<SuiviDefi>): Promise<SuiviDefi> {
        const suivi = new this.suiviDefiModel(suiviData);
        return await suivi.save();
    }

    async findById(id: string | Types.ObjectId): Promise<SuiviDefi | null> {
        return await this.suiviDefiModel.findById(id)
            .populate('utilisateur', 'nom email')
            .populate('defi', 'titre description difficulte')
            .exec();
    }

    async findAll(filter: Partial<SuiviDefi> = {}): Promise<SuiviDefi[]> {
        return await this.suiviDefiModel.find(filter)
            .populate('utilisateur', 'nom email')
            .populate('defi', 'titre description difficulte')
            .sort({ date: -1 })
            .exec();
    }

    async findByUser(userId: string | Types.ObjectId): Promise<SuiviDefi[]> {
        return await this.suiviDefiModel.find({ utilisateur: userId })
            .populate('defi', 'titre description difficulte')
            .sort({ date: -1 })
            .exec();
    }

    async findByDefi(defiId: string | Types.ObjectId): Promise<SuiviDefi[]> {
        return await this.suiviDefiModel.find({ defi: defiId })
            .populate('utilisateur', 'nom email')
            .sort({ date: -1 })
            .exec();
    }

    async findByUserAndDefi(userId: string | Types.ObjectId, defiId: string | Types.ObjectId): Promise<SuiviDefi[]> {
        return await this.suiviDefiModel.find({ 
            utilisateur: userId, 
            defi: defiId 
        })
        .sort({ date: -1 })
        .exec();
    }

    async findByProgression(progression: ProgressionDefi): Promise<SuiviDefi[]> {
        return await this.suiviDefiModel.find({ progression })
            .populate('utilisateur', 'nom email')
            .populate('defi', 'titre description difficulte')
            .sort({ date: -1 })
            .exec();
    }

    async getProgressionStats(defiId: string | Types.ObjectId): Promise<any> {
        const suivis = await this.suiviDefiModel.find({ defi: defiId });
        
        const totalParticipants = new Set(suivis.map(s => s.utilisateur.toString())).size;
        const termines = suivis.filter(s => s.progression === ProgressionDefi.TERMINE).length;
        const enCours = suivis.filter(s => s.progression === ProgressionDefi.EN_COURS).length;
        const abandonnes = suivis.filter(s => s.progression === ProgressionDefi.ABANDONNE).length;

        return {
            totalParticipants,
            termines,
            enCours,
            abandonnes,
            tauxReussite: totalParticipants > 0 ? (termines / totalParticipants) * 100 : 0
        };
    }

    async updateProgression(id: string | Types.ObjectId, progression: ProgressionDefi): Promise<SuiviDefi | null> {
        return await this.suiviDefiModel.findByIdAndUpdate(
            id, 
            { progression }, 
            { new: true }
        )
        .populate('utilisateur', 'nom email')
        .populate('defi', 'titre description difficulte')
        .exec();
    }

    async update(id: string | Types.ObjectId, updateData: Partial<SuiviDefi>): Promise<SuiviDefi | null> {
        return await this.suiviDefiModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('utilisateur', 'nom email')
            .populate('defi', 'titre description difficulte')
            .exec();
    }

    async delete(id: string | Types.ObjectId): Promise<SuiviDefi | null> {
        return await this.suiviDefiModel.findByIdAndDelete(id).exec();
    }
}
