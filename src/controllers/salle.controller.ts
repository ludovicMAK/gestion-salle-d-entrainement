import { Request, Response } from 'express';
import { SalleService } from '../services/mongoose/services';
import { Types } from 'mongoose';

export class SalleController {
    constructor(private salleService: SalleService) {}

    async createSalle(req: Request, res: Response): Promise<void> {
        try {
            const salleData = req.body;
            const salle = await this.salleService.create(salleData);
            res.status(201).json({ success: true, data: salle });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la création de la salle', error });
        }
    }

    async getSalle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const salle = await this.salleService.findById(id);
            
            if (!salle) {
                res.status(404).json({ success: false, message: 'Salle non trouvée' });
                return;
            }
            
            res.json({ success: true, data: salle });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la salle', error });
        }
    }

    async getSalles(req: Request, res: Response): Promise<void> {
        try {
            const { approved } = req.query;
            let salles;
            
            if (approved === 'true') {
                salles = await this.salleService.findApproved();
            } else {
                salles = await this.salleService.findAll();
            }
            
            res.json({ success: true, data: salles });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des salles', error });
        }
    }

    async getSallesByOwner(req: Request, res: Response): Promise<void> {
        try {
            const { ownerId } = req.params;
            const salles = await this.salleService.findByOwner(ownerId);
            res.json({ success: true, data: salles });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des salles du propriétaire', error });
        }
    }

    async searchSallesByEquipments(req: Request, res: Response): Promise<void> {
        try {
            const { equipements } = req.body;
            const salles = await this.salleService.searchByEquipments(equipements);
            res.json({ success: true, data: salles });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la recherche des salles', error });
        }
    }

    async updateSalle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const salle = await this.salleService.update(id, updateData);
            
            if (!salle) {
                res.status(404).json({ success: false, message: 'Salle non trouvée' });
                return;
            }
            
            res.json({ success: true, data: salle });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour de la salle', error });
        }
    }

    async approveSalle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const salle = await this.salleService.approve(id);
            
            if (!salle) {
                res.status(404).json({ success: false, message: 'Salle non trouvée' });
                return;
            }
            
            res.json({ success: true, data: salle, message: 'Salle approuvée avec succès' });
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
            
            const salle = await this.salleService.updateApproval(id, approuvee);
            
            if (!salle) {
                res.status(404).json({ success: false, message: 'Salle non trouvée' });
                return;
            }
            
            res.json({ 
                success: true, 
                data: salle, 
                message: `Salle ${approuvee ? 'approuvée' : 'désapprouvée'} avec succès` 
            });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors du changement d\'approbation de la salle', error });
        }
    }

    async deleteSalle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const salle = await this.salleService.delete(id);
            
            if (!salle) {
                res.status(404).json({ success: false, message: 'Salle non trouvée' });
                return;
            }
            
            res.json({ success: true, message: 'Salle supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la suppression de la salle', error });
        }
    }
}
