import {UserService} from "../services/mongoose";
import {Router, Request, Response, json} from "express";
import {SessionService} from "../services/mongoose";
import {sessionMiddleware} from "../middlewares";

export class AuthController {

    constructor(public readonly userService: UserService,
                public readonly sessionService: SessionService) {
    }

    async login(req: Request, res: Response) {
        if(!req.body || !req.body.email || !req.body.password) {
            res.status(400).end();
            return;
        }
        const user = await this.userService.findUser(req.body.email, req.body.password);
        if(!user) {
            res.status(401).end();
            return;
        }
        const session = await this.sessionService.createSession({
            user: user,
            expirationDate: new Date(Date.now() + 1_296_000_000) // eq NOW + 15 jours en millis 15 * 86_400 * 1000
        });
        res.status(201).json(session);
    }

    async me(req: Request, res: Response) {
        res.json(req.user);
    }

    async logout(req: Request, res: Response) {
        try {
            // Récupérer le token de la session depuis les headers
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (token) {
                await this.sessionService.deleteSession(token);
            }
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la déconnexion' });
        }
    }

    async register(req: Request, res: Response) {
        try {
            if (!req.body || !req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
                res.status(400).json({ error: 'Tous les champs sont requis' });
                return;
            }
            
            const user = await this.userService.createUser({
                email: req.body.email,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                role: req.body.role || 'user',
                actif: true
            });
            
            res.status(201).json(user);
        } catch (error) {
            res.status(409).json({ error: 'Email déjà utilisé' });
        }
    }

    buildRouter(): Router {
        const router = Router();
        router.post('/login', json(), this.login.bind(this));
        router.get('/me',
            sessionMiddleware(this.sessionService),
            this.me.bind(this));
        return router;
    }
}