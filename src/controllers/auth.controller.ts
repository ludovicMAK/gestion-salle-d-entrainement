import {UserService} from "../services/mongoose/services";
import {Router, Request, Response, json} from "express";
import {SessionService} from "../services/mongoose/services";
import {sessionMiddleware} from "../middlewares";

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
      expirationDate: new Date(Date.now() + 1_296_000_000), // eq NOW + 15 jours en millis 15 * 86_400 * 1000
    });
    
    // Créer une copie de l'utilisateur sans le mot de passe
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
    
    // Réponse optimisée pour Postman avec le token facilement accessible
    res.status(200).json({
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
    
    // Créer une copie de l'utilisateur sans le mot de passe
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

  async logout(req: Request, res: Response) {
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
  }

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

  async listSessions(req: Request, res: Response) {
    try {
      const sessions = await this.sessionService.getAllSessions();
      res.json(sessions);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des sessions" });
    }
  }
}