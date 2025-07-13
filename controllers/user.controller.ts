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
                role: UserRole.EMPLOYEE,
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
        await this.userService.updateRole(userId, UserRole.ADMIN);
        res.status(204).end();
    }

    async demoteUser(req: Request, res: Response) {
        const userId = req.params.id;
        await this.userService.updateRole(userId, UserRole.EMPLOYEE);
        res.status(204).end();
    }

    buildRouter(): Router {
        const router = Router();
        router.post('/',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.EMPLOYEE),
            json(),
            this.createUser.bind(this));
        router.patch('/:id/promote',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.ADMIN),
            this.promoteUser.bind(this));
        router.patch('/:id/demote',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.ADMIN),
            this.demoteUser.bind(this));
        return router;
    }
}