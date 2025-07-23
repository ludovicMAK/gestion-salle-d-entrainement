import {SessionService, UserService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole} from "../models";

export class UserController {
    constructor(public readonly userService: UserService,
                public readonly sessionService: SessionService) {
    }

    async createUser(req: Request, res: Response) {
        if(!req.body || !req.body.email || !req.body.password
            || !req.body.lastName || !req.body.firstName) {
            res.status(400).json({ error: 'Email, mot de passe, nom et prénom requis' });
            return;
        }
        
        // Si c'est un utilisateur normal, la salle est obligatoire
        if ((!req.body.role || req.body.role === UserRole.USER) && !req.body.gymId) {
            res.status(400).json({ error: 'ID de la salle requis pour l\'inscription d\'un utilisateur' });
            return;
        }
        
        try {
            const user = await this.userService.createUser({
                email: req.body.email,
                role: req.body.role || UserRole.USER,
                password: req.body.password,
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                gym: req.body.gymId
            });
            res.status(201).json({ message: 'Utilisateur créé avec succès', user });
        } catch (error: any) {
            console.error('Erreur création utilisateur:', error);
            if (error.message === 'Gym not found') {
                res.status(404).json({ error: 'Salle non trouvée' });
            } else if (error.message === 'Cannot register to an unapproved gym') {
                res.status(400).json({ error: 'Impossible de s\'inscrire à une salle non approuvée' });
            } else if (error.message === 'Invalid gym ID') {
                res.status(400).json({ error: 'ID de salle invalide' });
            } else {
                res.status(409).json({ error: 'Email déjà utilisé ou erreur lors de la création' });
            }
        }
    }

    async promoteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUser(userId);
            if (!user) {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
                return;
            }
            
            await this.userService.updateRole(userId, UserRole.OWNER);
            res.status(200).json({ message: 'Utilisateur promu au rang de propriétaire' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la promotion de l\'utilisateur' });
        }
    }

    async demoteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUser(userId);
            if (!user) {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
                return;
            }
            
            await this.userService.updateRole(userId, UserRole.USER);
            res.status(200).json({ message: 'Utilisateur rétrogradé au rang d\'utilisateur' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la rétrogradation de l\'utilisateur' });
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            let users;
            
            if (!req.user) {
                // Si pas d'utilisateur connecté, retourner une liste vide ou une erreur
                res.status(401).json({ error: 'Authentification requise' });
                return;
            }
            
            if (req.user.role === UserRole.SUPER_ADMIN) {
                // Super admin voit tous les utilisateurs
                users = await this.userService.getUsers();
            } else if (req.user.role === UserRole.OWNER) {
                // Owner voit seulement les utilisateurs inscrits à ses salles
                users = await this.userService.getUsersByOwner(req.user._id as string);
            } else {
                // Les utilisateurs normaux ne peuvent pas voir la liste des utilisateurs
                res.status(403).json({ error: 'Accès non autorisé' });
                return;
            }
            
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUser(userId);
            if (!user) {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
                return;
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const updateData = req.body;
            
            if (Object.keys(updateData).length === 0) {
                res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
                return;
            }
            
            const user = await this.userService.updateUser(userId, updateData);
            if (!user) {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
                return;
            }
            res.json({ message: 'Utilisateur mis à jour avec succès', user });
        } catch (error) {
            console.error('Erreur mise à jour utilisateur:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const deleted = await this.userService.deleteUser(userId);
            if (!deleted) {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
        } catch (error) {
            console.error('Erreur suppression utilisateur:', error);
            res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
        }
    }

    async getUsersByRole(req: Request, res: Response) {
        try {
            const role = req.params.role;
            const users = await this.userService.getUsersByRole(role);
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs par rôle' });
        }
    }

    async getUsersByGym(req: Request, res: Response) {
        try {
            const gymId = req.params.gymId;
            
            if (!req.user) {
                res.status(401).json({ error: 'Authentification requise' });
                return;
            }
            
            // Vérifier si l'utilisateur a le droit de voir les utilisateurs de cette salle
            if (req.user.role === UserRole.SUPER_ADMIN) {
                // Super admin peut voir tous les utilisateurs de toutes les salles
            } else if (req.user.role === UserRole.OWNER) {
                // Vérifier que la salle appartient à ce propriétaire
                const gym = await this.userService.connection.models.Gym.findById(gymId);
                if (!gym || gym.owner.toString() !== req.user._id?.toString()) {
                    res.status(403).json({ error: 'Accès refusé : vous ne pouvez voir que les utilisateurs de vos propres salles' });
                    return;
                }
            } else {
                res.status(403).json({ error: 'Accès non autorisé' });
                return;
            }
            
            const users = await this.userService.getUsersByGym(gymId);
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs de la salle' });
        }
    }

    async toggleUserStatus(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const { actif } = req.body;
            
            if (typeof actif !== 'boolean') {
                res.status(400).json({ error: 'Le statut actif doit être un booléen' });
                return;
            }
            
            const user = await this.userService.toggleUserStatus(userId, actif);
            if (!user) {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
                return;
            }
            
            const message = actif ? 'Utilisateur activé' : 'Utilisateur désactivé';
            res.json({ message, user });
        } catch (error) {
            console.error('Erreur changement statut utilisateur:', error);
            res.status(500).json({ error: 'Erreur lors du changement de statut' });
        }
    }

    buildRouter(): Router {
        const router = Router();
        
        // Routes protégées - nécessitent une authentification
        router.get('/users',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.OWNER), // Owner ou plus
            this.getUsers.bind(this));
        
        router.get('/users/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.OWNER), // Owner ou plus
            this.getUser.bind(this));
            
        router.get('/gyms/:gymId/users',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.OWNER), // Owner ou plus
            this.getUsersByGym.bind(this));
        
        router.get('/users/role/:role',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.OWNER), // Owner ou plus
            this.getUsersByRole.bind(this));
        
        // Routes protégées - SUPER_ADMIN seulement
        router.post('/users',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.createUser.bind(this));
        
        router.put('/users/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.updateUser.bind(this));
        
        router.delete('/users/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.deleteUser.bind(this));
        
        router.patch('/users/:id/promote',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.promoteUser.bind(this));
        
        router.patch('/users/:id/demote',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.demoteUser.bind(this));
        
        router.patch('/users/:id/toggle-status',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.toggleUserStatus.bind(this));
        
        return router;
    }
}