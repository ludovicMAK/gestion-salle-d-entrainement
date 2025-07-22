import {SessionService, UserService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole} from "../models";
import { EquipmentService } from "../services/mongoose/services/equipment.service";

export class EquipmentController {
    async getEquipmentById(req: Request, res: Response) {
        const equipmentId = req.params.id;
        if (!equipmentId) {
            res.status(400).end();
            return;
        }
        try {
            const equipment = await this.equipmentService.getEquipmentById(equipmentId);
            if (!equipment) {
                res.status(404).json({ error: 'Équipement non trouvé' });
                return;
            }
            res.status(200).json(equipment);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'équipement' });
        }
    }
    constructor(public readonly equipmentService: EquipmentService,
                public readonly sessionService: SessionService) {
    }
    async createEquipment(req: Request, res: Response) {
        if (!req.body || !req.body.name || !req.body.muscleGroups) {
            res.status(400).end();
            return;
        }
        try {
            const equipment = await this.equipmentService.createEquipment({
                name: req.body.name,
                description: req.body.description,
                muscleGroups: req.body.muscleGroups,
            });
            res.status(201).json(equipment);
        } catch (error) {
            res.status(409).json({ error: 'Erreur lors de la création de l\'équipement' });
        }
    }

    async getEquipments(req: Request, res: Response) {
        try {
            const equipments = await this.equipmentService.getEquipments();
            res.status(200).json(equipments);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des équipements' });
        }
    }
    async updateEquipment(req: Request, res: Response) {
        const equipmentId = req.params.id;
        const updateData = req.body;

        if (!equipmentId || !updateData) {
            res.status(400).end();
            return;
        }

        try {
            const updatedEquipment = await this.equipmentService.updateEquipment(equipmentId, updateData);
            if (!updatedEquipment) {
                res.status(404).json({ error: 'Équipement non trouvé' });
                return;
            }
            res.status(200).json(updatedEquipment);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'équipement' });
        }
    }
    async deleteEquipment(req: Request, res: Response) {
        const equipmentId = req.params.id;

        if (!equipmentId) {
            res.status(400).end();
            return;
        }

        try {
            const deletedEquipment = await this.equipmentService.deleteEquipment(equipmentId);
            if (!deletedEquipment) {
                res.status(404).json({ error: 'Équipement non trouvé' });
                return;
            }
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la suppression de l\'équipement' });
        }
    }

    buildRouter(): Router {
        const router = Router();
        // Admin routes
        router.post('/admin/equipments',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.createEquipment.bind(this));
        router.put('/admin/equipments/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.updateEquipment.bind(this));
        router.delete('/admin/equipments/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.deleteEquipment.bind(this));
        // Public routes
        router.get('/equipments', this.getEquipments.bind(this));
        router.get('/equipments/:id', this.getEquipmentById.bind(this));
        return router;
    }
}