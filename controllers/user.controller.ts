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
            res.status(400).end();
            return;
        }
        try {
            const user = await this.userService.createUser({
                email: req.body.email,
                role: UserRole.USER,
                password: req.body.password,
                lastName: req.body.lastName,
                firstName: req.body.firstName
            });
            res.status(201).json(user);
        } catch {
            res.status(409).end(); // CONFLICT
        }
    }

    async promoteUser(req: Request, res: Response) {
        const userId = req.params.id;
        await this.userService.updateRole(userId, UserRole.OWNER);
        res.status(204).end();
    }

    async demoteUser(req: Request, res: Response) {
        const userId = req.params.id;
        await this.userService.updateRole(userId, UserRole.USER);
        res.status(204).end();
    }

    async getUsers(req: Request, res: Response) {
        try {
            const users = await this.userService.getUsers();
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
            const user = await this.userService.updateUser(userId, updateData);
            if (!user) {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
                return;
            }
            res.json(user);
        } catch (error) {
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
            res.status(204).end();
        } catch (error) {
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

    async toggleUserStatus(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const { actif } = req.body;
            const user = await this.userService.toggleUserStatus(userId, actif);
            if (!user) {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
                return;
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors du changement de statut' });
        }
    }

    buildRouter(): Router {
        const router = Router();
        router.post('/',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.createUser.bind(this));
        router.patch('/:id/promote',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.promoteUser.bind(this));
        router.patch('/:id/demote',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.demoteUser.bind(this));
        return router;
    }
}