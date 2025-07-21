import {UserService} from "../services/mongoose/services";
import {Router, Request, Response, json} from "express";
import {SessionService} from "../services/mongoose/services";
import {sessionMiddleware} from "../middlewares";
import {UserRole} from "../models";

export class AuthController {
  constructor(
    public readonly userService: UserService,
    public readonly sessionService: SessionService
  ) {}

  async login(req: Request, res: Response) {
    if (!req.body || !req.body.email || !req.body.password) {
      res.status(400).json({ error: 'Email et mot de passe requis' });
      return;
    }
    
    const user = await this.userService.findUser(
      req.body.email,
      req.body.password
    );
    if (!user) {
      res.status(401).json({ error: 'Identifiants invalides' });
      return;
    }
    
    const session = await this.sessionService.createSession({
      user: user,
      expirationDate: new Date(Date.now() + 1_296_000_000), 
    });
    
    const userSafe = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      actif: user.actif,
      score: user.score,
      badges: user.badges,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.status(201).json({
      success: true,
      message: 'Connexion réussie',
      token: session.token,
      user: userSafe,
      expiresAt: session.expirationDate
    });
  }

  async me(req: Request, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Utilisateur non authentifié' });
      return;
    }
    
    const userSafe = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      actif: req.user.actif,
      score: req.user.score,
      badges: req.user.badges,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt
    };
    
    res.json(userSafe);
  }
  async subscribe(req: Request, res: Response) {
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
  //Todo: Implement logout functionality
  /*async logout(req: Request, res: Response) {
    try {
      // Récupérer le token de la session depuis les headers
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (token) {
        await this.sessionService.deleteSession(token);
      }
      res.status(204).json({ message: "Déconnexion réussie" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la déconnexion" });
    }
  }*/


  async register(req: Request, res: Response) {
    try {
      if (
        !req.body ||
        !req.body.email ||
        !req.body.password ||
        !req.body.firstName ||
        !req.body.lastName
      ) {
        res.status(400).json({ error: "Tous les champs sont requis" });
        return;
      }

      const user = await this.userService.createUser({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role || "USER",
        actif: true,
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(409).json({ error: "Email déjà utilisé" });
    }
  }
  
   buildRouter(): Router {
        const router = Router();
        router.post('/login', json(), this.login.bind(this));
        router.post('/register', json(), this.register.bind(this));
        router.post('/subscribe', json(), this.subscribe.bind(this));
        router.get('/me',
            sessionMiddleware(this.sessionService),
            this.me.bind(this));
        return router;
    }
  
}