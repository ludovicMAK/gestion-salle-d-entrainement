import { Request, Response } from 'express';
import { BadgeService } from '../services/mongoose/services';

export class BadgeController {
    constructor(private badgeService: BadgeService) {}

    async createBadge(req: Request, res: Response): Promise<void> {
        try {
            const badgeData = req.body;
            const badge = await this.badgeService.create(badgeData);
            res.status(201).json({ success: true, data: badge });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la création du badge', error });
        }
    }

    async getBadge(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const badge = await this.badgeService.findById(id);
            
            if (!badge) {
                res.status(404).json({ success: false, message: 'Badge non trouvé' });
                return;
            }
            
            res.json({ success: true, data: badge });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération du badge', error });
        }
    }

    async getBadges(req: Request, res: Response): Promise<void> {
        try {
            const badges = await this.badgeService.findAll();
            res.json({ success: true, data: badges });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des badges', error });
        }
    }

    async getBadgesByPoints(req: Request, res: Response): Promise<void> {
        try {
            const { minPoints } = req.params;
            const badges = await this.badgeService.findByPoints(parseInt(minPoints));
            res.json({ success: true, data: badges });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des badges par points', error });
        }
    }

    async updateBadge(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const badge = await this.badgeService.update(id, updateData);
            
            if (!badge) {
                res.status(404).json({ success: false, message: 'Badge non trouvé' });
                return;
            }
            
            res.json({ success: true, data: badge });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour du badge', error });
        }
    }

    async deleteBadge(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const badge = await this.badgeService.delete(id);
            
            if (!badge) {
                res.status(404).json({ success: false, message: 'Badge non trouvé' });
                return;
            }
            
            res.json({ success: true, message: 'Badge supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la suppression du badge', error });
        }
    }
}
