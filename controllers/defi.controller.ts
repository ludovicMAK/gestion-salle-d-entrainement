import { Request, Response, Router, json } from 'express';
import { DefiService, SessionService, DefiSuiviService, BadgeService, BadgeRuleService, UserService } from '../services/mongoose/services';
import { sessionMiddleware, roleMiddleware } from '../middlewares';
import { UserRole } from '../models';

export class DefiController {
    constructor(
        private defiService: DefiService,
        private defiSuiviService: DefiSuiviService,
        private badgeService: BadgeService,
        private badgeRuleService: BadgeRuleService,
        private userService: UserService,
        private sessionService: SessionService
    ) {}

    async createDefi(req: Request, res: Response): Promise<void> {
        try {
            const defiData = req.body;
            const defi = await this.defiService.create(defiData);
            res.status(201).json({ success: true, data: defi });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la création du défi', error });
        }
    }

    async getDefi(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const defi = await this.defiService.findById(id);
            
            if (!defi) {
                res.status(404).json({ success: false, message: 'Défi non trouvé' });
                return;
            }
            
            res.json({ success: true, data: defi });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération du défi', error });
        }
    }

    async getDefis(req: Request, res: Response): Promise<void> {
        try {
            const defis = await this.defiService.findAll();
            res.json({ success: true, data: defis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des défis', error });
        }
    }

    async getDefisByType(req: Request, res: Response): Promise<void> {
        try {
            const { type } = req.params;
            if (!['SOCIAL', 'GYM'].includes(type)) {
                res.status(400).json({ success: false, message: 'Type de défi invalide' });
                return;
            }
            
            const defis = await this.defiService.findByType(type as 'SOCIAL' | 'GYM');
            res.json({ success: true, data: defis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des défis par type', error });
        }
    }

    async getDefisByCreator(req: Request, res: Response): Promise<void> {
        try {
            const { creatorId } = req.params;
            const defis = await this.defiService.findByCreator(creatorId);
            res.json({ success: true, data: defis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des défis par créateur', error });
        }
    }

    async getDefisByGym(req: Request, res: Response): Promise<void> {
        try {
            const { gymId } = req.params;
            const defis = await this.defiService.findByGym(gymId);
            res.json({ success: true, data: defis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des défis par salle', error });
        }
    }

    async getDefisByDifficulty(req: Request, res: Response): Promise<void> {
        try {
            const { difficulty } = req.params;
            if (!['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
                res.status(400).json({ success: false, message: 'Difficulté invalide' });
                return;
            }
            
            const defis = await this.defiService.findByDifficulty(difficulty as 'EASY' | 'MEDIUM' | 'HARD');
            res.json({ success: true, data: defis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des défis par difficulté', error });
        }
    }

    async getPublicDefis(req: Request, res: Response): Promise<void> {
        try {
            const defis = await this.defiService.findPublicDefis();
            res.json({ success: true, data: defis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des défis publics', error });
        }
    }

    async updateDefi(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const defi = await this.defiService.update(id, updateData);
            
            if (!defi) {
                res.status(404).json({ success: false, message: 'Défi non trouvé' });
                return;
            }
            
            res.json({ success: true, data: defi });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour du défi', error });
        }
    }

    async deleteDefi(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const defi = await this.defiService.delete(id);
            
            if (!defi) {
                res.status(404).json({ success: false, message: 'Défi non trouvé' });
                return;
            }
            
            res.json({ success: true, message: 'Défi supprimé avec succès', data: defi });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la suppression du défi', error });
        }
    }

    async joinDefi(req: Request, res: Response): Promise<void> {
        try {
            const { defiId } = req.params;
            const { userId } = req.body;
            
            const defi = await this.defiService.findById(defiId);
            if (!defi) {
                res.status(404).json({ success: false, message: 'Défi non trouvé' });
                return;
            }

            const existingSuivi = await this.defiSuiviService.findByUser(userId);
            const alreadyJoined = existingSuivi.some(suivi => 
                suivi.defi.toString() === defiId && ['ACTIVE', 'COMPLETED'].includes(suivi.status)
            );
            
            if (alreadyJoined) {
                res.status(400).json({ success: false, message: 'Vous participez déjà à ce défi' });
                return;
            }

            const defiSuivi = await this.defiSuiviService.create({
                user: userId as any,
                defi: defiId as any,
                targetRepetitions: defi.numberOfRepetitions,
                status: 'ACTIVE'
            });

            res.status(201).json({ success: true, data: defiSuivi, message: 'Participation au défi enregistrée' });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la participation au défi', error });
        }
    }

    async updateProgress(req: Request, res: Response): Promise<void> {
        try {
            const { suiviId } = req.params;
            const { currentRepetitions } = req.body;

            if (typeof currentRepetitions !== 'number' || currentRepetitions < 0) {
                res.status(400).json({ success: false, message: 'Nombre de répétitions invalide' });
                return;
            }

            const updatedSuivi = await this.defiSuiviService.updateProgress(suiviId, currentRepetitions);
            
            if (!updatedSuivi) {
                res.status(404).json({ success: false, message: 'Suivi de défi non trouvé' });
                return;
            }

            let awardedBadges: any[] = [];
            if (updatedSuivi.status === 'COMPLETED') {
                awardedBadges = await this.checkAndAwardBadges(updatedSuivi.user);
            }

            res.json({ 
                success: true, 
                data: updatedSuivi,
                awardedBadges,
                message: awardedBadges.length > 0 ? `Progression mise à jour ! ${awardedBadges.length} nouveaux badges obtenus !` : 'Progression mise à jour'
            });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour de la progression', error });
        }
    }

    async getUserDefis(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const { status } = req.query;

            let userDefis;
            if (status && typeof status === 'string') {
                userDefis = await this.defiSuiviService.findByStatus(status as any);
                userDefis = userDefis.filter(suivi => suivi.user.toString() === userId);
            } else {
                userDefis = await this.defiSuiviService.findByUser(userId);
            }

            res.json({ success: true, data: userDefis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des défis utilisateur', error });
        }
    }

    async getUserStats(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const stats = await this.defiSuiviService.getUserStats(userId);
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des statistiques', error });
        }
    }

    private async checkAndAwardBadges(userId: any): Promise<any[]> {
        try {
            const awardedBadges: any[] = [];
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
            return [];
        }
    }

    private async checkBadgeEligibility(rule: any, userId: any, userStats: any, userDefis: any[]): Promise<boolean> {
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

    async getLeaderboard(req: Request, res: Response): Promise<void> {
        try {
            const { defiId } = req.params;
            const leaderboard = defiId 
                ? await this.defiSuiviService.getLeaderboard(defiId)
                : await this.defiSuiviService.getLeaderboard();
            
            res.json({ success: true, data: leaderboard });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération du classement', error });
        }
    }

    getRouter(): Router {
        const router = Router();
        router.use(json());

        router.get('/public', this.getPublicDefis.bind(this));
        router.get('/leaderboard', this.getLeaderboard.bind(this));
        router.get('/leaderboard/:defiId', this.getLeaderboard.bind(this));

        router.use(sessionMiddleware(this.sessionService));

        router.post('/', roleMiddleware(UserRole.USER), this.createDefi.bind(this));
        router.get('/', this.getDefis.bind(this));
        router.get('/:id', this.getDefi.bind(this));
        router.put('/:id', roleMiddleware(UserRole.OWNER), this.updateDefi.bind(this));
        router.delete('/:id', roleMiddleware(UserRole.OWNER), this.deleteDefi.bind(this));

        router.get('/type/:type', this.getDefisByType.bind(this));
        router.get('/creator/:creatorId', this.getDefisByCreator.bind(this));
        router.get('/gym/:gymId', this.getDefisByGym.bind(this));
        router.get('/difficulty/:difficulty', this.getDefisByDifficulty.bind(this));

        router.post('/:defiId/join', this.joinDefi.bind(this));
        
        router.put('/suivi/:suiviId/progress', json(), this.updateProgress.bind(this));
        
        router.get('/users/:userId/defis', this.getUserDefis.bind(this));
        router.get('/users/:userId/stats', this.getUserStats.bind(this));

        return router;
    }
} 