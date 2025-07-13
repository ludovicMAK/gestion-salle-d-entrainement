import { Request, Response } from 'express';
import { ExerciceService, ExerciceTypeService } from '../services/mongoose/services';
import { NiveauExercice } from '../models';

export class ExerciceController {
    constructor(
        private exerciceService: ExerciceService,
        private exerciceTypeService: ExerciceTypeService
    ) {}

    async createExercice(req: Request, res: Response): Promise<void> {
        try {
            const exerciceData = req.body;
            const exercice = await this.exerciceService.create(exerciceData);
            res.status(201).json({ success: true, data: exercice });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la création de l\'exercice', error });
        }
    }

    async getExercice(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const exercice = await this.exerciceService.findById(id);
            
            if (!exercice) {
                res.status(404).json({ success: false, message: 'Exercice non trouvé' });
                return;
            }
            
            res.json({ success: true, data: exercice });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération de l\'exercice', error });
        }
    }

    async getExercices(req: Request, res: Response): Promise<void> {
        try {
            const { type, niveau, actif } = req.query;
            
            let filter: any = {};
            if (type) filter.typeExercice = type;
            if (niveau) filter.niveau = niveau;
            if (actif !== undefined) filter.actif = actif === 'true';
            
            const exercices = await this.exerciceService.findAll(filter);
            res.json({ success: true, data: exercices });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des exercices', error });
        }
    }

    async getExercicesByType(req: Request, res: Response): Promise<void> {
        try {
            const { typeId } = req.params;
            const exercices = await this.exerciceService.findByType(typeId);
            res.json({ success: true, data: exercices });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des exercices par type', error });
        }
    }

    async getExercicesByNiveau(req: Request, res: Response): Promise<void> {
        try {
            const { niveau } = req.params;
            const exercices = await this.exerciceService.findByNiveau(niveau as NiveauExercice);
            res.json({ success: true, data: exercices });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des exercices par niveau', error });
        }
    }

    async searchExercicesByMuscles(req: Request, res: Response): Promise<void> {
        try {
            const { muscles } = req.body;
            const exercices = await this.exerciceService.findByMuscles(muscles);
            res.json({ success: true, data: exercices });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la recherche des exercices par muscles', error });
        }
    }

    async searchExercicesByEquipments(req: Request, res: Response): Promise<void> {
        try {
            const { equipements } = req.body;
            const exercices = await this.exerciceService.findByEquipments(equipements);
            res.json({ success: true, data: exercices });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la recherche des exercices par équipements', error });
        }
    }

    async updateExercice(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const exercice = await this.exerciceService.update(id, updateData);
            
            if (!exercice) {
                res.status(404).json({ success: false, message: 'Exercice non trouvé' });
                return;
            }
            
            res.json({ success: true, data: exercice });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour de l\'exercice', error });
        }
    }

    async activateExercice(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const exercice = await this.exerciceService.activate(id);
            
            if (!exercice) {
                res.status(404).json({ success: false, message: 'Exercice non trouvé' });
                return;
            }
            
            res.json({ success: true, data: exercice, message: 'Exercice activé avec succès' });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de l\'activation de l\'exercice', error });
        }
    }

    async deactivateExercice(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const exercice = await this.exerciceService.deactivate(id);
            
            if (!exercice) {
                res.status(404).json({ success: false, message: 'Exercice non trouvé' });
                return;
            }
            
            res.json({ success: true, data: exercice, message: 'Exercice désactivé avec succès' });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la désactivation de l\'exercice', error });
        }
    }

    async deleteExercice(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const exercice = await this.exerciceService.delete(id);
            
            if (!exercice) {
                res.status(404).json({ success: false, message: 'Exercice non trouvé' });
                return;
            }
            
            res.json({ success: true, message: 'Exercice supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la suppression de l\'exercice', error });
        }
    }
}
