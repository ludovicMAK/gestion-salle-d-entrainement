import { SessionService, UserService } from "../services/mongoose";
import { Request, Response, Router, json } from "express";
import { roleMiddleware, sessionMiddleware } from "../middlewares";
import { UserRole } from "../models";
import { EquipmentService } from "../services/mongoose/services/equipment.service";
import { Types } from 'mongoose';

export class EquipmentController {
    constructor(
        public readonly equipmentService: EquipmentService,
        public readonly sessionService: SessionService,
        public readonly userService: UserService
    ) {}

    async createEquipment(req: Request, res: Response) {
        if (!req.body || !req.body.name || !req.body.muscleGroups) {
            res.status(400).json({ error: 'Nom et groupes musculaires requis' });
            return;
        }
        if (!req.user) {
            res.status(401).json({ error: 'Utilisateur non authentifié' });
            return;
        }

        let ownerId: string;

        if (req.user.role === UserRole.SUPER_ADMIN) {
            ownerId = req.body.ownerId || req.user._id?.toString() || "";
            
            if (req.body.ownerId) {
                try {
                    const owner = await this.userService.getUser(req.body.ownerId);
                    if (!owner) {
                        res.status(404).json({ error: 'Propriétaire spécifié non trouvé' });
                        return;
                    }
                } catch (error) {
                    res.status(400).json({ error: 'ID de propriétaire invalide' });
                    return;
                }
            }
        } else if (req.user.role === UserRole.OWNER) {
            ownerId = req.user._id?.toString() || "";
        } else {
            res.status(403).json({ error: 'Seuls les propriétaires et super-admins peuvent créer des équipements' });
            return;
        }

        if (!ownerId) {
            res.status(400).json({ error: 'Impossible de déterminer le propriétaire' });
            return;
        }

        try {
            const equipment = await this.equipmentService.create({
                name: req.body.name,
                description: req.body.description || '',
                muscleGroups: req.body.muscleGroups,
                owner: new Types.ObjectId(ownerId),
                gym: req.body.gymId ? new Types.ObjectId(req.body.gymId) : undefined,
            });
            res.status(201).json({ message: 'Équipement créé avec succès', equipment });
        } catch (error) {
            console.error('Erreur création équipement:', error);
            res.status(409).json({ error: 'Erreur lors de la création de l\'équipement', details: error });
        }
    }

    async getEquipments(req: Request, res: Response) {
        try {
            const equipments = await this.equipmentService.findAll();
            res.json(equipments);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des équipements' });
        }
    }

    async getMyEquipments(req: Request, res: Response) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Utilisateur non authentifié' });
                return;
            }
            
            const equipments = await this.equipmentService.findByOwner(req.user._id as string);
            res.json(equipments);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération de vos équipements' });
        }
    }

    async getEquipmentsByGym(req: Request, res: Response) {
        try {
            const gymId = req.params.gymId;
            if (!gymId || !Types.ObjectId.isValid(gymId)) {
                res.status(400).json({ error: 'ID de salle invalide' });
                return;
            }
            const equipments = await this.equipmentService.findByGym(gymId);
            res.json(equipments);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Erreur lors de la récupération des équipements de la salle' });
        }
    }

    async getEquipment(req: Request, res: Response) {
        try {
            const equipmentId = req.params.id;
            const equipment = await this.equipmentService.findById(equipmentId);
            if (!equipment) {
                res.status(404).json({ error: 'Équipement non trouvé' });
                return;
            }
            res.json(equipment);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'équipement' });
        }
    }

    async updateEquipment(req: Request, res: Response) {
        try {
            const equipmentId = req.params.id;
            const updateData = req.body;
            
            if (!req.user) {
                res.status(401).json({ error: 'Utilisateur non authentifié' });
                return;
            }
            
            const equipment = await this.equipmentService.findById(equipmentId);
            if (!equipment) {
                res.status(404).json({ error: 'Équipement non trouvé' });
                return;
            }
            
            if (req.user.role !== UserRole.SUPER_ADMIN && equipment.owner._id?.toString() !== req.user._id?.toString()) {
                res.status(403).json({ error: 'Accès refusé : vous ne pouvez modifier que vos propres équipements' });
                return;
            }
            
            const updatedEquipment = await this.equipmentService.update(equipmentId, updateData);
            res.json(updatedEquipment);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'équipement' });
        }
    }

    async deleteEquipment(req: Request, res: Response) {
        try {
            const equipmentId = req.params.id;
            
            if (!req.user) {
                res.status(401).json({ error: 'Utilisateur non authentifié' });
                return;
            }
            
            const equipment = await this.equipmentService.findById(equipmentId);

            if (!equipment) {
                res.status(404).json({ error: 'Équipement non trouvé' });
                return;
            }
            
            if (req.user.role !== UserRole.SUPER_ADMIN && equipment.owner._id?.toString() !== req.user._id?.toString()) {
                res.status(403).json({ error: 'Accès refusé : vous ne pouvez supprimer que vos propres équipements' });
                return;
            }
            
            await this.equipmentService.delete(equipmentId);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la suppression de l\'équipement' });
        }
    }

    buildRouter(): Router {
        const router = Router();
        
        router.get('/', this.getEquipments.bind(this));
        router.get('/my-equipments',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.OWNER),
            this.getMyEquipments.bind(this));
        
        router.get('/gyms/:gymId/equipments', this.getEquipmentsByGym.bind(this));
        
        router.post('/',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.OWNER),
            json(),
            this.createEquipment.bind(this));
        
        
        router.put('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.OWNER),
            json(),
            this.updateEquipment.bind(this));
        
        router.delete('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.OWNER),
            this.deleteEquipment.bind(this));
        router.get('/:id', this.getEquipment.bind(this));
        
        return router;
    }
}