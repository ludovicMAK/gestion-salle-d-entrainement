import { Request, Response } from 'express';
import { DefiService } from '../services/mongoose/services';
import { DifficulteDefi, StatutDefi } from '../models';

export class DefiController {
    constructor(private defiService: DefiService) {}

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
            const { difficulte, statut } = req.query;
            
            let filter: any = {};
            if (difficulte) filter.difficulte = difficulte;
            if (statut) filter.statut = statut;
            
            const defis = await this.defiService.findAll(filter);
            res.json({ success: true, data: defis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des défis', error });
        }
    }

    async getDefisByCreator(req: Request, res: Response): Promise<void> {
        try {
            const { creatorId } = req.params;
            const defis = await this.defiService.findByCreator(creatorId);
            res.json({ success: true, data: defis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des défis du créateur', error });
        }
    }

    async getDefisBySalle(req: Request, res: Response): Promise<void> {
        try {
            const { salleId } = req.params;
            const defis = await this.defiService.findBySalle(salleId);
            res.json({ success: true, data: defis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des défis de la salle', error });
        }
    }

    async getDefisByDifficulte(req: Request, res: Response): Promise<void> {
        try {
            const { difficulte } = req.params;
            const defis = await this.defiService.findByDifficulte(difficulte as DifficulteDefi);
            res.json({ success: true, data: defis });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des défis par difficulté', error });
        }
    }

    async joinDefi(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            const defi = await this.defiService.joinDefi(id, userId);
            
            if (!defi) {
                res.status(404).json({ success: false, message: 'Défi non trouvé' });
                return;
            }
            
            res.json({ success: true, data: defi, message: 'Utilisateur ajouté au défi avec succès' });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de l\'inscription au défi', error });
        }
    }

    async leaveDefi(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            const defi = await this.defiService.leaveDefi(id, userId);
            
            if (!defi) {
                res.status(404).json({ success: false, message: 'Défi non trouvé' });
                return;
            }
            
            res.json({ success: true, data: defi, message: 'Utilisateur retiré du défi avec succès' });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la désinscription du défi', error });
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

    async terminateDefi(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const defi = await this.defiService.terminate(id);
            
            if (!defi) {
                res.status(404).json({ success: false, message: 'Défi non trouvé' });
                return;
            }
            
            res.json({ success: true, data: defi, message: 'Défi terminé avec succès' });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors de la terminaison du défi', error });
        }
    }

    async changeDefiStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { statut } = req.body;
            
            if (!statut || !['actif', 'termine', 'suspendu'].includes(statut)) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Statut invalide. Valeurs autorisées: actif, termine, suspendu' 
                });
                return;
            }
            
            const defi = await this.defiService.updateStatus(id, statut as StatutDefi);
            
            if (!defi) {
                res.status(404).json({ success: false, message: 'Défi non trouvé' });
                return;
            }
            
            res.json({ 
                success: true, 
                data: defi, 
                message: `Statut du défi changé vers "${statut}" avec succès` 
            });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Erreur lors du changement de statut du défi', error });
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
            
            res.json({ success: true, message: 'Défi supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la suppression du défi', error });
        }
    }
}
