import {SessionService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole} from "../models";
import { ExerciseTypeService } from "../services/mongoose/services/exerciseType.service";

export class ExerciseTypeController {
    constructor(
                    public readonly sessionService: SessionService,
                    public readonly exerciseTypeService: ExerciseTypeService) {
        }
    async createExerciseType(req: Request, res: Response) {
        try {
            const exerciseType = await this.exerciseTypeService.create(req.body);
            console.log(req.body);
            res.status(200).json(exerciseType);
        } catch (error) {
            res.status(400).json({ error: "Erreur lors de la création du type d'exercice", details: error });
        }
    }

    async updateExerciseType(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updated = await this.exerciseTypeService.update(id, req.body);
            if (!updated) {
                res.status(404).json({ error: "Type d'exercice non trouvé" });
                return;
            }
            res.json(updated);
        } catch (error) {
            res.status(400).json({ error: "Erreur lors de la modification du type d'exercice", details: error });
        }
    }

    async deleteExerciseType(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await this.exerciseTypeService.delete(id);
            if (!deleted) {
                res.status(404).json({ error: "Type d'exercice non trouvé" });
                return;
            }
            res.json({ success: true, message: "Type d'exercice supprimé" });
        } catch (error) {
            res.status(400).json({ error: "Erreur lors de la suppression du type d'exercice", details: error });
        }
    }
    
    async getAllExerciseTypes(req: Request, res: Response) {
        try {
            const exerciseTypes = await this.exerciseTypeService.getAll();
            res.json(exerciseTypes);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des types d\'exercice' });
        }
    }
    async getExerciseType(req: Request, res: Response) {
        const { id } = req.params;
        const exerciseType = await this.exerciseTypeService.getById(id);
        
        if (!exerciseType) {
            res.status(404).json({ error: 'Type d\'exercice non trouvé' });
            return;
        }
        
        res.json(exerciseType);
    }

    buildRouter(): Router {
        const router = Router();
        router.get('/', this.getAllExerciseTypes.bind(this));
        router.get('/:id', this.getExerciseType.bind(this));
        router.get('/admin/exercise-types',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.getAllExerciseTypes.bind(this));
        router.get('/admin/exercise-types/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.getExerciseType.bind(this));
        router.post('/',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.createExerciseType.bind(this));
        router.put('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.updateExerciseType.bind(this));
        router.delete('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.deleteExerciseType.bind(this));
        return router;
    }
}