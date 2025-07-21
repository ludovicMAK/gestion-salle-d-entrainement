import { Model, Types } from "mongoose";
import { SeanceEntrainement } from "../../../models";

export class SeanceEntrainementService {
    constructor(private seanceModel: Model<SeanceEntrainement>) {}

    async create(seanceData: Partial<SeanceEntrainement>): Promise<SeanceEntrainement> {
        const seance = new this.seanceModel(seanceData);
        return await seance.save();
    }

    async findById(id: string | Types.ObjectId): Promise<SeanceEntrainement | null> {
        return await this.seanceModel.findById(id)
            .populate('utilisateur', 'nom email')
            .populate('salle', 'nom adresse')
            .populate('exercices.exercice', 'nom description typeExercice')
            .populate('defi', 'titre description')
            .exec();
    }

    async findAll(filter: Partial<SeanceEntrainement> = {}): Promise<SeanceEntrainement[]> {
        return await this.seanceModel.find(filter)
            .populate('utilisateur', 'nom email')
            .populate('salle', 'nom adresse')
            .populate('exercices.exercice', 'nom description typeExercice')
            .populate('defi', 'titre description')
            .sort({ date: -1 })
            .exec();
    }

    async findByUser(userId: string | Types.ObjectId): Promise<SeanceEntrainement[]> {
        return await this.seanceModel.find({ utilisateur: userId })
            .populate('salle', 'nom adresse')
            .populate('exercices.exercice', 'nom description typeExercice')
            .populate('defi', 'titre description')
            .sort({ date: -1 })
            .exec();
    }

    async findBySalle(salleId: string | Types.ObjectId): Promise<SeanceEntrainement[]> {
        return await this.seanceModel.find({ salle: salleId })
            .populate('utilisateur', 'nom email')
            .populate('exercices.exercice', 'nom description typeExercice')
            .populate('defi', 'titre description')
            .sort({ date: -1 })
            .exec();
    }

    async findByDefi(defiId: string | Types.ObjectId): Promise<SeanceEntrainement[]> {
        return await this.seanceModel.find({ defi: defiId })
            .populate('utilisateur', 'nom email')
            .populate('salle', 'nom adresse')
            .populate('exercices.exercice', 'nom description typeExercice')
            .sort({ date: -1 })
            .exec();
    }

    async findByDateRange(startDate: Date, endDate: Date, userId?: string | Types.ObjectId): Promise<SeanceEntrainement[]> {
        const filter: any = {
            date: { $gte: startDate, $lte: endDate }
        };
        
        if (userId) {
            filter.utilisateur = userId;
        }

        return await this.seanceModel.find(filter)
            .populate('utilisateur', 'nom email')
            .populate('salle', 'nom adresse')
            .populate('exercices.exercice', 'nom description typeExercice')
            .populate('defi', 'titre description')
            .sort({ date: -1 })
            .exec();
    }

    async getStats(userId: string | Types.ObjectId): Promise<any> {
        const seances = await this.seanceModel.find({ utilisateur: userId });
        
        const totalSeances = seances.length;
        const totalCalories = seances.reduce((sum, seance) => sum + seance.caloriesBrulees, 0);
        const totalDuree = seances.reduce((sum, seance) => sum + seance.dureeMinutes, 0);
        const moyenneCaloriesParSeance = totalSeances > 0 ? totalCalories / totalSeances : 0;
        const moyenneDureeParSeance = totalSeances > 0 ? totalDuree / totalSeances : 0;

        return {
            totalSeances,
            totalCalories,
            totalDuree,
            moyenneCaloriesParSeance,
            moyenneDureeParSeance
        };
    }

    async update(id: string | Types.ObjectId, updateData: Partial<SeanceEntrainement>): Promise<SeanceEntrainement | null> {
        return await this.seanceModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('utilisateur', 'nom email')
            .populate('salle', 'nom adresse')
            .populate('exercices.exercice', 'nom description typeExercice')
            .populate('defi', 'titre description')
            .exec();
    }

    async delete(id: string | Types.ObjectId): Promise<SeanceEntrainement | null> {
        return await this.seanceModel.findByIdAndDelete(id).exec();
    }
}
