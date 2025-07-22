import { Request, Response, Router, json } from 'express';
import { BadgeService, SessionService } from '../services/mongoose/services';
import { sessionMiddleware, roleMiddleware } from '../middlewares';
import { UserRole } from '../models';

export class BadgeController {
    constructor(
        private badgeService: BadgeService,
        private sessionService: SessionService
    ) {}

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

    buildRouter(): Router {
        const router = Router();
        
        // Routes publiques
        router.get('/badges', this.getBadges.bind(this));
        router.get('/badges/:id', this.getBadge.bind(this));
        router.get('/badges/points/:minPoints', this.getBadgesByPoints.bind(this));
        
        // Routes admin (SUPER_ADMIN uniquement)
        router.post('/admin/badges',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.createBadge.bind(this));
        router.put('/admin/badges/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.updateBadge.bind(this));
        router.delete('/admin/badges/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.deleteBadge.bind(this));
            
        return router;
    }
}
