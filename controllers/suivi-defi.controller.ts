import { Request, Response } from 'express';
import { SuiviDefiService } from '../services/mongoose/services';
import { ProgressionDefi } from '../models';

export class SuiviDefiController {
    constructor(private suiviDefiService: SuiviDefiService) {}

    async createSuivi(req: Request, res: Response): Promise<void> {
        try {
            const suiviData = req.body;
            const suivi = await this.suiviDefiService.create(suiviData);
            res.status(201).json({ success: true, data: suivi });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la création du suivi', error });
        }
    }

    async getSuivi(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const suivi = await this.suiviDefiService.findById(id);
            
            if (!suivi) {
                res.status(404).json({ success: false, message: 'Suivi non trouvé' });
                return;
            }
            
            res.json({ success: true, data: suivi });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération du suivi', error });
        }
    }

    async getSuivis(req: Request, res: Response): Promise<void> {
        try {
            const { userId, defiId, progression } = req.query;
            
            let filter: any = {};
            if (userId) filter.utilisateur = userId;
            if (defiId) filter.defi = defiId;
            if (progression) filter.progression = progression;
            
            const suivis = await this.suiviDefiService.findAll(filter);
            res.json({ success: true, data: suivis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des suivis', error });
        }
    }

    async getSuivisByUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const suivis = await this.suiviDefiService.findByUser(userId);
            res.json({ success: true, data: suivis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des suivis de l\'utilisateur', error });
        }
    }

    async getSuivisByDefi(req: Request, res: Response): Promise<void> {
        try {
            const { defiId } = req.params;
            const suivis = await this.suiviDefiService.findByDefi(defiId);
            res.json({ success: true, data: suivis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des suivis du défi', error });
        }
    }

    async getSuivisByUserAndDefi(req: Request, res: Response): Promise<void> {
        try {
            const { userId, defiId } = req.params;
            const suivis = await this.suiviDefiService.findByUserAndDefi(userId, defiId);
            res.json({ success: true, data: suivis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des suivis utilisateur/défi', error });
        }
    }

    async getSuivisByProgression(req: Request, res: Response): Promise<void> {
        try {
            const { progression } = req.params;
            const suivis = await this.suiviDefiService.findByProgression(progression as ProgressionDefi);
            res.json({ success: true, data: suivis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des suivis par progression', error });
        }
    }

    async getProgressionStats(req: Request, res: Response): Promise<void> {
        try {
            const { defiId } = req.params;
            const stats = await this.suiviDefiService.getProgressionStats(defiId);
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des statistiques de progression', error });
        }
    }

    async updateProgression(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { progression } = req.body;
            const suivi = await this.suiviDefiService.updateProgression(id, progression);
            
            if (!suivi) {
                res.status(404).json({ success: false, message: 'Suivi non trouvé' });
                return;
            }
            
            res.json({ success: true, data: suivi, message: 'Progression mise à jour avec succès' });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour de la progression', error });
        }
    }

    async updateSuivi(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const suivi = await this.suiviDefiService.update(id, updateData);
            
            if (!suivi) {
                res.status(404).json({ success: false, message: 'Suivi non trouvé' });
                return;
            }
            
            res.json({ success: true, data: suivi });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour du suivi', error });
        }
    }

    async deleteSuivi(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const suivi = await this.suiviDefiService.delete(id);
            
            if (!suivi) {
                res.status(404).json({ success: false, message: 'Suivi non trouvé' });
                return;
            }
            
            res.json({ success: true, message: 'Suivi supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la suppression du suivi', error });
        }
    }
}
