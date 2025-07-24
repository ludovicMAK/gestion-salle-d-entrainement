import { Request, Response, Router, json } from 'express';
import { BadgeService, SessionService, BadgeRuleService, DefiSuiviService, UserService } from '../services/mongoose/services';
import { sessionMiddleware, roleMiddleware } from '../middlewares';
import { UserRole, Badge } from '../models';
import { Types } from 'mongoose';

export class BadgeController {
    constructor(
        private badgeService: BadgeService,
        private badgeRuleService: BadgeRuleService,
        private defiSuiviService: DefiSuiviService,
        private userService: UserService,
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

    async getUserBadges(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const user = await this.userService.findById(userId.toString());
            
            if (!user) {
                res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
                return;
            }

            const userWithBadges = await this.userService.findByIdWithBadges(userId);
            res.json({ success: true, data: userWithBadges?.badges || [] });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des badges utilisateur', error });
        }
    }

    async getAvailableBadges(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            
            const activeRules = await this.badgeRuleService.findActive();
            
            const userStats = await this.defiSuiviService.getUserStats(userId);
            const userDefis = await this.defiSuiviService.findByUser(userId);
            
            const availableBadges = [];
            
            for (const rule of activeRules) {
                const eligible = await this.checkBadgeEligibility(rule, userId, userStats, userDefis);
                if (eligible) {
                    availableBadges.push({
                        rule,
                        badge: rule.badge,
                        progress: await this.calculateProgress(rule, userStats, userDefis)
                    });
                }
            }
            
            res.json({ success: true, data: availableBadges });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des badges disponibles', error });
        }
    }

    async getBadgeRules(req: Request, res: Response): Promise<void> {
        try {
            const rules = await this.badgeRuleService.findActive();
            res.json({ success: true, data: rules });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des règles de badges', error });
        }
    }

    async awardBadgeToUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId, badgeId } = req.params;
            
            const user = await this.userService.findById(userId);
            if (!user) {
                res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
                return;
            }

            const badge = await this.badgeService.findById(badgeId);
            if (!badge) {
                res.status(404).json({ success: false, message: 'Badge non trouvé' });
                return;
            }

            const userBadges = user.badges || [];
            if (userBadges.some((b: any) => b.toString() === badgeId)) {
                res.status(400).json({ success: false, message: 'L\'utilisateur possède déjà ce badge' });
                return;
            }

            const updatedUser = await this.userService.addBadgeToUser(userId, badgeId);
            res.json({ success: true, data: updatedUser, message: 'Badge attribué avec succès' });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de l\'attribution du badge', error });
        }
    }

    async checkAndAwardBadges(userId: string | Types.ObjectId): Promise<Badge[]> {
        try {
            const awardedBadges: Badge[] = [];
            const activeRules = await this.badgeRuleService.findActive();
            const userStats = await this.defiSuiviService.getUserStats(userId);
            const userDefis = await this.defiSuiviService.findByUser(userId);
            const user = await this.userService.findById(userId.toString());
            
            if (!user) return awardedBadges;

            const userBadgeIds = (user.badges || []).map((b: any) => b.toString());

            for (const rule of activeRules) {
                const badgeId = rule.badge.toString();
                
                if (userBadgeIds.includes(badgeId)) continue;

                const eligible = await this.checkBadgeEligibility(rule, userId, userStats, userDefis);
                if (eligible) {
                    await this.userService.addBadgeToUser(userId.toString(), badgeId);
                    const badge = await this.badgeService.findById(badgeId);
                    if (badge) awardedBadges.push(badge);
                }
            }

            return awardedBadges;
        } catch (error) {
            console.error('Erreur lors de la vérification des badges:', error);
            return [];
        }
    }

    private async checkBadgeEligibility(rule: any, userId: string | Types.ObjectId, userStats: any, userDefis: any[]): Promise<boolean> {
        for (const condition of rule.conditions) {
            switch (condition.type) {
                case 'DEFI_COMPLETION':
                    const completedCount = userStats.completed || 0;
                    if (completedCount < condition.value) return false;
                    break;
                
                case 'REPETITIONS':
                    const totalReps = userDefis.reduce((sum, defi) => sum + (defi.currentRepetitions || 0), 0);
                    if (totalReps < condition.value) return false;
                    break;
                
                case 'CONSECUTIVE_DAYS':
                    break;
                
                case 'SCORE_THRESHOLD':
                    const totalPoints = userStats.totalPoints || 0;
                    if (totalPoints < condition.value) return false;
                    break;
                
                case 'DIFFICULTY_LEVEL':
                    if (condition.difficulty) {
                        const difficultyDefis = userDefis.filter(defi => 
                            defi.defi?.difficulty === condition.difficulty && defi.status === 'COMPLETED'
                        );
                        if (difficultyDefis.length < condition.value) return false;
                    }
                    break;

                default:
                    return false;
            }
        }
        return true;
    }

    private async calculateProgress(rule: any, userStats: any, userDefis: any[]): Promise<number> {
        const condition = rule.conditions[0]; 
        
        switch (condition.type) {
            case 'DEFI_COMPLETION':
                const completed = userStats.completed || 0;
                return Math.min(100, (completed / condition.value) * 100);
                
            case 'REPETITIONS':
                const totalReps = userDefis.reduce((sum, defi) => sum + (defi.currentRepetitions || 0), 0);
                return Math.min(100, (totalReps / condition.value) * 100);
                
            default:
                return 0;
        }
    }

    buildRouter(): Router {
        const router = Router();
        
        router.get('/badges', this.getBadges.bind(this));
        router.get('/badges/:id', this.getBadge.bind(this));
        router.get('/badge-rules', this.getBadgeRules.bind(this));
        
        router.use(sessionMiddleware(this.sessionService));
        
        router.get('/users/:userId/badges', this.getUserBadges.bind(this));
        router.get('/users/:userId/available-badges', this.getAvailableBadges.bind(this));
        
        router.post('/admin/badges',
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.createBadge.bind(this));
        router.put('/admin/badges/:id',
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.updateBadge.bind(this));
        router.delete('/admin/badges/:id',
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.deleteBadge.bind(this));
        router.post('/admin/users/:userId/badges/:badgeId',
            roleMiddleware(UserRole.OWNER),
            this.awardBadgeToUser.bind(this));
            
        return router;
    }
}
