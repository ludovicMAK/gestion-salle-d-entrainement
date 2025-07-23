import {SessionService, UserService} from "../services/mongoose";
import { GymService } from '../services/mongoose/services';
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole} from "../models";
import { Types } from 'mongoose';

export class GymController {
  constructor(
    public readonly gymService: GymService,
    public readonly sessionService: SessionService,
    public readonly userService: UserService
  ) {}

  async createGym(req: Request, res: Response) {
    if (!req.body || !req.body.name || !req.body.address) {
      res.status(400).json({ error: 'Nom et adresse requis' });
      return;
    }
    if (!req.user) {
      res.status(401).json({ error: 'Utilisateur non authentifié' });
      return;
    }
    
    let ownerId: string;
    let isApproved = false;
    let message = "";
    
    if (req.user.role === UserRole.SUPER_ADMIN) {
      ownerId = req.body.ownerId || req.user._id?.toString() || "";
      isApproved = true;
      message = "Salle créée et approuvée automatiquement";
      
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
      isApproved = false;
      message = "Demande de création de salle soumise, en attente d'approbation";
    } else {
      res.status(403).json({ error: 'Seuls les propriétaires et super-admins peuvent créer des salles' });
      return;
    }
    
    if (!ownerId) {
      res.status(400).json({ error: 'Impossible de déterminer le propriétaire' });
      return;
    }
    
    try {
      const gym = await this.gymService.create({
        name: req.body.name,
        description: req.body.description || '',
        address: req.body.address,
        phone: req.body.phone || '',
        email: req.body.email || '',
        capacity: req.body.capacity || 50,
        equipments: req.body.equipments || [],
        exerciseTypes: req.body.exerciseTypes || [],
        difficultyLevels: req.body.difficultyLevels || [],
        isApproved: isApproved,
        owner: new Types.ObjectId(ownerId),
      });
      res.status(201).json({ message, gym });
    } catch (error) {
      console.error('Erreur création salle:', error);
      res.status(409).json({ error: 'Erreur lors de la création de la salle', details: error });
    }
  }

  async getGyms(req: Request, res: Response) {
    try {
      const gyms = await this.gymService.findAll();
      res.json(gyms);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des salles' });
    }
  }

  async getApprovedGyms(req: Request, res: Response) {
    try {
      const approvedGyms = await this.gymService.findAll({ isApproved: true });
      res.json(approvedGyms);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des salles approuvées' });
    }
  }

  async getMyGyms(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Utilisateur non authentifié' });
        return;
      }
      
      const gyms = await this.gymService.findByOwner(req.user._id as string);
      res.json(gyms);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de vos salles' });
    }
  }

  async getPendingGyms(req: Request, res: Response) {
    try {
      const pendingGyms = await this.gymService.findAll({ isApproved: false });
      res.json(pendingGyms);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des salles en attente' });
    }
  }

  async getGym(req: Request, res: Response) {
    try {
      const gymId = req.params.id;
      const gym = await this.gymService.findById(gymId);
      if (!gym) {
        res.status(404).json({ error: 'Salle non trouvée' });
        return;
      }
      res.json(gym);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de la salle' });
    }
  }

  async updateGym(req: Request, res: Response) {
    try {
      const gymId = req.params.id;
      const updateData = req.body;
      
      if (!req.user) {
        res.status(401).json({ error: 'Utilisateur non authentifié' });
        return;
      }
      
      const gym = await this.gymService.findById(gymId);
      if (!gym) {
        res.status(404).json({ error: 'Salle non trouvée' });
        return;
      }
      
      if (req.user.role !== UserRole.SUPER_ADMIN && gym.owner.toString() !== req.user._id?.toString()) {
        res.status(403).json({ error: 'Accès refusé : vous ne pouvez modifier que vos propres salles' });
        return;
      }
      
      const updatedGym = await this.gymService.update(gymId, updateData);
      res.json(updatedGym);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la salle' });
    }
  }

  async deleteGym(req: Request, res: Response) {
    try {
      const gymId = req.params.id;
      
      if (!req.user) {
        res.status(401).json({ error: 'Utilisateur non authentifié' });
        return;
      }
      
      const gym = await this.gymService.findById(gymId);
      if (!gym) {
        res.status(404).json({ error: 'Salle non trouvée' });
        return;
      }
      
      if (req.user.role !== UserRole.SUPER_ADMIN && gym.owner.toString() !== req.user._id?.toString()) {
        res.status(403).json({ error: 'Accès refusé : vous ne pouvez supprimer que vos propres salles' });
        return;
      }
      
      await this.gymService.delete(gymId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de la salle' });
    }
  }

  async approveGym(req: Request, res: Response) {
    try {
      const gymId = req.params.id;
      const gym = await this.gymService.approve(gymId);
      if (!gym) {
        res.status(404).json({ error: 'Salle non trouvée' });
        return;
      }
      res.json({ message: 'Salle approuvée', gym });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'approbation de la salle' });
    }
  }

  async addEquipmentToGym(req: Request, res: Response) {
    try {
      const gymId = req.params.id;
      const equipmentId = req.body.equipmentId;

      if (!equipmentId) {
        res.status(400).json({ error: 'ID de l\'équipement requis' });
        return;
      }

      if (!req.user) {
        res.status(401).json({ error: 'Utilisateur non authentifié' });
        return;
      }

      const gym = await this.gymService.findById(gymId);
      if (!gym) {
        res.status(404).json({ error: 'Salle non trouvée' });
        return;
      }

      if (req.user.role !== UserRole.SUPER_ADMIN && gym.owner.toString() !== req.user._id?.toString()) {
        res.status(403).json({ error: 'Accès refusé : vous ne pouvez modifier que vos propres salles' });
        return;
      }

      const updatedGym = await this.gymService.addEquipmentToGym(gymId, equipmentId);
      res.json({ message: 'Équipement ajouté à la salle', gym: updatedGym });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'équipement' });
    }
  }

  async removeEquipmentFromGym(req: Request, res: Response) {
    try {
      const gymId = req.params.id;
      const equipmentId = req.params.equipmentId;

      if (!req.user) {
        res.status(401).json({ error: 'Utilisateur non authentifié' });
        return;
      }

      const gym = await this.gymService.findById(gymId);
      if (!gym) {
        res.status(404).json({ error: 'Salle non trouvée' });
        return;
      }

      if (req.user.role !== UserRole.SUPER_ADMIN && gym.owner.toString() !== req.user._id?.toString()) {
        res.status(403).json({ error: 'Accès refusé : vous ne pouvez modifier que vos propres salles' });
        return;
      }

      const updatedGym = await this.gymService.removeEquipmentFromGym(gymId, equipmentId);
      res.json({ message: 'Équipement retiré de la salle', gym: updatedGym });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors du retrait de l\'équipement' });
    }
  }

  buildRouter(): Router {
    const router = Router();
    
    router.get('/gyms', this.getGyms.bind(this));
    router.get('/gyms/approved', this.getApprovedGyms.bind(this)); // Route publique pour les salles approuvées
    router.get('/gyms/:id', this.getGym.bind(this));
    
    router.post('/gyms',
      sessionMiddleware(this.sessionService),
      roleMiddleware(UserRole.OWNER),
      json(),
      this.createGym.bind(this));
    
    router.get('/my-gyms',
      sessionMiddleware(this.sessionService),
      roleMiddleware(UserRole.OWNER),
      this.getMyGyms.bind(this));
    
    router.put('/gyms/:id',
      sessionMiddleware(this.sessionService),
      roleMiddleware(UserRole.OWNER),
      json(),
      this.updateGym.bind(this));
    router.delete('/gyms/:id',
      sessionMiddleware(this.sessionService),
      roleMiddleware(UserRole.OWNER),
      this.deleteGym.bind(this));
    
    router.get('/admin/gyms/pending',
      sessionMiddleware(this.sessionService),
      roleMiddleware(UserRole.SUPER_ADMIN),
      this.getPendingGyms.bind(this));
    router.post('/admin/gyms/:id/approve',
      sessionMiddleware(this.sessionService),
      roleMiddleware(UserRole.SUPER_ADMIN),
      this.approveGym.bind(this));
    
    router.post('/gyms/:id/equipments',
      sessionMiddleware(this.sessionService),
      roleMiddleware(UserRole.OWNER),
      json(),
      this.addEquipmentToGym.bind(this));
    router.delete('/gyms/:id/equipments/:equipmentId',
      sessionMiddleware(this.sessionService),
      roleMiddleware(UserRole.OWNER),
      this.removeEquipmentFromGym.bind(this));
    
    return router;
  }
}