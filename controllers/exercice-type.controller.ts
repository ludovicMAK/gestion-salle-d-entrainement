import { Request, Response } from 'express';
import { ExerciceTypeService } from '../services/mongoose/services';

export class ExerciceTypeController {
    constructor(private exerciceTypeService: ExerciceTypeService) {}

    async createExerciceType(req: Request, res: Response): Promise<void> {
        try {
            const exerciceTypeData = req.body;
            const exerciceType = await this.exerciceTypeService.create(exerciceTypeData);
            res.status(201).json({ success: true, data: exerciceType });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la création du type d\'exercice', error });
        }
    }

    async getExerciceType(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const exerciceType = await this.exerciceTypeService.findById(id);
            
            if (!exerciceType) {
                res.status(404).json({ success: false, message: 'Type d\'exercice non trouvé' });
                return;
            }
            
            res.json({ success: true, data: exerciceType });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération du type d\'exercice', error });
        }
    }

    async getExerciceTypes(req: Request, res: Response): Promise<void> {
        try {
            const exerciceTypes = await this.exerciceTypeService.findAll();
            res.json({ success: true, data: exerciceTypes });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des types d\'exercices', error });
        }
    }

    async updateExerciceType(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const exerciceType = await this.exerciceTypeService.update(id, updateData);
            
            if (!exerciceType) {
                res.status(404).json({ success: false, message: 'Type d\'exercice non trouvé' });
                return;
            }
            
            res.json({ success: true, data: exerciceType });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour du type d\'exercice', error });
        }
    }

    async deleteExerciceType(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const exerciceType = await this.exerciceTypeService.delete(id);
            
            if (!exerciceType) {
                res.status(404).json({ success: false, message: 'Type d\'exercice non trouvé' });
                return;
            }
            
            res.json({ success: true, message: 'Type d\'exercice supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la suppression du type d\'exercice', error });
        }
    }
}
