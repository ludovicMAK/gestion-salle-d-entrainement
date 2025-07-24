import { Request, Response, Router, json } from "express";
import { sessionMiddleware, roleMiddleware } from "../middlewares";
import { TrainingSheetService, SessionService, UserService } from "../services/mongoose";
import { UserRole } from "../models";

export class TrainingSheetController {
    constructor(
        public readonly sessionService: SessionService,
        public readonly trainingSheetService: TrainingSheetService,
        public readonly userService: UserService
    ) {}

    async createSheet(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const sheetData = {
                ...req.body,
                user: user._id
            };

            const sheet = await this.trainingSheetService.create(sheetData);
            res.status(201).json(sheet);
        } catch (error) {
            res.status(400).json({ error: "Erreur lors de la création de la fiche", details: error });
        }
    }

    async getMySheets(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const sheets = await this.trainingSheetService.findByUser(user._id);
            res.json(sheets);
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération des fiches" });
        }
    }

    async getUserSheets(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const currentUser = (req as any).user;
            
            const targetUser = await this.userService.getUser(userId);
            if (!targetUser) {
                res.status(404).json({ error: "Utilisateur non trouvé" });
                return;
            }
            
            if (currentUser.role === UserRole.SUPER_ADMIN) {
            } else if (currentUser.role === UserRole.OWNER) {
                if (!targetUser.gym) {
                    res.status(403).json({ error: "Accès refusé : utilisateur sans salle" });
                    return;
                }
                
                const gym = await this.userService.connection.models.Gym.findById(targetUser.gym);
                if (!gym || gym.owner.toString() !== currentUser._id?.toString()) {
                    res.status(403).json({ error: "Accès refusé : vous ne pouvez voir que les fiches des utilisateurs de vos salles" });
                    return;
                }
            } else if (currentUser._id?.toString() === userId) {
                // L'utilisateur peut voir ses propres fiches (équivalent à getMySheets)
                // L'utilisateur peut voir ses propres fiches (équivalent à getMySheets)
            } else {
                res.status(403).json({ error: "Accès refusé" });
                return;
            }
            
            const sheets = await this.trainingSheetService.findByUser(userId);
            res.json(sheets);
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération des fiches de l'utilisateur" });
        }
    }

    async getSheet(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = (req as any).user;
            
            const sheet = await this.trainingSheetService.findById(id);
            
            if (!sheet) {
                res.status(404).json({ error: "Fiche non trouvée" });
                return;
            }
    
            if (sheet.user.toString() !== user._id.toString() && user.role !== UserRole.SUPER_ADMIN) {
                res.status(403).json({ error: "Accès non autorisé à cette fiche" });
                return;
            }
            
            res.json(sheet);
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération de la fiche" });
        }
    }

    async updateSheet(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = (req as any).user;
            
            const existingSheet = await this.trainingSheetService.findById(id);
            if (!existingSheet || 
                (existingSheet.user.toString() !== user._id.toString() && user.role !== UserRole.SUPER_ADMIN)) {
                res.status(403).json({ error: "Vous ne pouvez pas modifier cette fiche" });
                return;
            }

            const updated = await this.trainingSheetService.update(id, req.body);
            
            if (!updated) {
                res.status(404).json({ error: "Fiche non trouvée" });
                return;
            }
            
            res.json(updated);
        } catch (error) {
            res.status(400).json({ error: "Erreur lors de la modification de la fiche", details: error });
        }
    }

    async deleteSheet(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = (req as any).user;
            
            const existingSheet = await this.trainingSheetService.findById(id);
            if (!existingSheet || 
                (existingSheet.user.toString() !== user._id.toString() && user.role !== UserRole.SUPER_ADMIN)) {
                res.status(403).json({ error: "Vous ne pouvez pas supprimer cette fiche" });
                return;
            }

            const deleted = await this.trainingSheetService.delete(id);
            
            if (!deleted) {
                res.status(404).json({ error: "Fiche non trouvée" });
                return;
            }
            
            res.json({ success: true, message: "Fiche supprimée" });
        } catch (error) {
            res.status(400).json({ error: "Erreur lors de la suppression de la fiche", details: error });
        }
    }

    buildRouter(): Router {
        const router = Router();

        router.get('/training-sheets',
            sessionMiddleware(this.sessionService),
            this.getMySheets.bind(this));

        router.get('/users/:userId/training-sheets',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getUserSheets.bind(this));

        router.get('/training-sheets/:id',
            sessionMiddleware(this.sessionService),
            this.getSheet.bind(this));

        router.post('/training-sheets',
            sessionMiddleware(this.sessionService),
            json(),
            this.createSheet.bind(this));

        router.put('/training-sheets/:id',
            sessionMiddleware(this.sessionService),
            json(),
            this.updateSheet.bind(this));

        router.delete('/training-sheets/:id',
            sessionMiddleware(this.sessionService),
            this.deleteSheet.bind(this));

        return router;
    }
} 