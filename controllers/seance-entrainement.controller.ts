import { Request, Response } from 'express';
import { SeanceEntrainementService } from '../services/mongoose/services';

export class SeanceEntrainementController {
    constructor(private seanceService: SeanceEntrainementService) {}

    async createSeance(req: Request, res: Response): Promise<void> {
        try {
            const seanceData = req.body;
            const seance = await this.seanceService.create(seanceData);
            res.status(201).json({ success: true, data: seance });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la création de la séance', error });
        }
    }

    async getSeance(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const seance = await this.seanceService.findById(id);
            
            if (!seance) {
                res.status(404).json({ success: false, message: 'Séance non trouvée' });
                return;
            }
            
            res.json({ success: true, data: seance });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la séance', error });
        }
    }

    async getSeances(req: Request, res: Response): Promise<void> {
        try {
            const { userId, salleId, defiId } = req.query;
            
            let filter: any = {};
            if (userId) filter.utilisateur = userId;
            if (salleId) filter.salle = salleId;
            if (defiId) filter.defi = defiId;
            
            const seances = await this.seanceService.findAll(filter);
            res.json({ success: true, data: seances });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des séances', error });
        }
    }

    async getSeancesByUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const seances = await this.seanceService.findByUser(userId);
            res.json({ success: true, data: seances });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des séances de l\'utilisateur', error });
        }
    }

    async getSeancesBySalle(req: Request, res: Response): Promise<void> {
        try {
            const { salleId } = req.params;
            const seances = await this.seanceService.findBySalle(salleId);
            res.json({ success: true, data: seances });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des séances de la salle', error });
        }
    }

    async getSeancesByDefi(req: Request, res: Response): Promise<void> {
        try {
            const { defiId } = req.params;
            const seances = await this.seanceService.findByDefi(defiId);
            res.json({ success: true, data: seances });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des séances du défi', error });
        }
    }

    async getSeancesByDateRange(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate, userId } = req.query;
            
            if (!startDate || !endDate) {
                res.status(400).json({ success: false, message: 'Les dates de début et de fin sont requises' });
                return;
            }
            
            const seances = await this.seanceService.findByDateRange(
                new Date(startDate as string), 
                new Date(endDate as string),
                userId as string
            );
            res.json({ success: true, data: seances });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des séances par période', error });
        }
    }

    async getUserStats(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const stats = await this.seanceService.getStats(userId);
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des statistiques', error });
        }
    }

    async updateSeance(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const seance = await this.seanceService.update(id, updateData);
            
            if (!seance) {
                res.status(404).json({ success: false, message: 'Séance non trouvée' });
                return;
            }
            
            res.json({ success: true, data: seance });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour de la séance', error });
        }
    }

    async deleteSeance(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const seance = await this.seanceService.delete(id);
            
            if (!seance) {
                res.status(404).json({ success: false, message: 'Séance non trouvée' });
                return;
            }
            
            res.json({ success: true, message: 'Séance supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la suppression de la séance', error });
        }
    }
}
