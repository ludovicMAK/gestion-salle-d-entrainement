import {SessionService, UserService} from "../services/mongoose";
import { GymService } from '../services/mongoose/services';
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole} from "../models";
import { Types } from 'mongoose';

export class GymController {
    async removeEquipment(req: Request, res: Response): Promise<void> {
        try {
            const { id, equipmentId } = req.params;
            // Récupère la salle
            const gym = await this.gymService.findById(id);
            if (!gym) {
                res.status(404).json({ success: false, message: "Gym non trouvé" });
                return;
            }
            // Filtre l'équipement à retirer
            const updatedEquipments = gym.equipments.filter((eq: any) => eq.toString() !== equipmentId);
            const updatedGym = await this.gymService.update(id, { equipments: updatedEquipments });
            res.json({ success: true, data: updatedGym, message: "Équipement retiré avec succès" });
        } catch (error) {
            res.status(400).json({ success: false, message: "Erreur lors du retrait de l'équipement", error });
        }
    }
    async updateEquipments(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { equipments } = req.body;
            if (!Array.isArray(equipments)) {
                res.status(400).json({ success: false, message: "Le champ 'equipments' doit être un tableau" });
                return;
            }
            const gym = await this.gymService.update(id, { equipments });
            if (!gym) {
                res.status(404).json({ success: false, message: "Gym non trouvé" });
                return;
            }
            res.json({ success: true, data: gym, message: "Équipements mis à jour avec succès" });
        } catch (error) {
            res.status(400).json({ success: false, message: "Erreur lors de la mise à jour des équipements", error });
        }
    }
    constructor(private gymService: GymService, private sessionService: SessionService, private userService: UserService) {}

    async createGym(req: Request, res: Response): Promise<void> {
        try {
            const gymData = req.body;
            const gym = await this.gymService.create(gymData);
            res.status(201).json({ success: true, data: gym });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la création de la salle', error });
        }
    }

    async getSalle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const gym = await this.gymService.findById(id);

            if (!gym) {
                res.status(404).json({ success: false, message: 'Gym non trouvé' });
                return;
            }

            res.json({ success: true, data: gym });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la salle', error });
        }
    }

    async getGyms(req: Request, res: Response): Promise<void> {
        try {
            const { approved } = req.query;
            let gyms;

            if (approved === 'true') {
                gyms = await this.gymService.findApproved();
            } else {
                gyms = await this.gymService.findAll();
            }

            res.json({ success: true, data: gyms });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des salles', error });
        }
    }

    async getSallesByOwner(req: Request, res: Response): Promise<void> {
        try {
            const { ownerId } = req.params;
            const gyms = await this.gymService.findByOwner(ownerId);
            res.json({ success: true, data: gyms });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des salles du propriétaire', error });
        }
    }

    async searchGymsByEquipments(req: Request, res: Response): Promise<void> {
        try {
            const { equipements } = req.body;
            const gyms = await this.gymService.searchByEquipments(equipements);
            res.json({ success: true, data: gyms });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la recherche des gyms', error });
        }
    }

    async updateGym(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const gym = await this.gymService.update(id, updateData);

            if (!gym) {
                res.status(404).json({ success: false, message: 'Gym non trouvé' });
                return;
            }

            res.json({ success: true, data: gym });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour de la salle', error });
        }
    }

    async approveGym(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const gym = await this.gymService.approve(id);

            if (!gym) {
                res.status(404).json({ success: false, message: 'Gym non trouvé' });
                return;
            }
            
            res.json({ success: true, data: gym, message: 'Salle approuvée avec succès' });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de l\'approbation de la salle', error });
        }
    }

    async toggleSalleApproval(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { approuvee } = req.body;
            
            if (typeof approuvee !== 'boolean') {
                res.status(400).json({ success: false, message: 'Le champ approuvee doit être un booléen' });
                return;
            }

            const gym = await this.gymService.updateApproval(id, approuvee);

            if (!gym) {
                res.status(404).json({ success: false, message: 'Gym non trouvé' });
                return;
            }
            
            res.json({ 
                success: true, 
                data: gym, 
                message: `Gym ${approuvee ? 'approuvé' : 'désapprouvé'} avec succès` 
            });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors du changement d\'approbation du gym', error });
        }
    }

    async deleteGym(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const gym = await this.gymService.delete(id);

            if (!gym) {
                res.status(404).json({ success: false, message: 'Gym non trouvé' });
                return;
            }

            res.json({ success: true, message: 'Gym supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la suppression du gym', error });
        }
    }
    


    
    buildRouter(): Router {
            const router = Router();
            router.post('/admin/gyms',
                sessionMiddleware(this.sessionService),
                roleMiddleware(UserRole.SUPER_ADMIN),
                json(),
                this.createGym.bind(this));
            router.put('/admin/gyms/:id',
                sessionMiddleware(this.sessionService),
                roleMiddleware(UserRole.SUPER_ADMIN),
                this.updateGym.bind(this));
            router.delete('/admin/gyms/:id',
                sessionMiddleware(this.sessionService),
                roleMiddleware(UserRole.SUPER_ADMIN),
                this.deleteGym.bind(this));
            router.get('/admin/gyms',
                sessionMiddleware(this.sessionService),
                roleMiddleware(UserRole.SUPER_ADMIN),
                this.getGyms.bind(this));
            router.post('/admin/gyms/:id/approve',
                sessionMiddleware(this.sessionService),
                roleMiddleware(UserRole.SUPER_ADMIN),
                this.approveGym.bind(this));
            router.post('/admin/gyms/:id/equipments',
                sessionMiddleware(this.sessionService),
                roleMiddleware(UserRole.SUPER_ADMIN),
                json(),
                this.updateEquipments.bind(this));
            router.delete('/admin/gyms/:id/equipments/:equipmentId',
                sessionMiddleware(this.sessionService),
                roleMiddleware(UserRole.SUPER_ADMIN),
                this.removeEquipment.bind(this));
            return router;
        }
}
