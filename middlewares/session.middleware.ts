import {Request, RequestHandler} from "express";
import {SessionService} from "../services/mongoose";
import {User, Session} from "../models";

declare module 'express' {
    interface Request {
        session?: Session;
        user?: User;
    }
}

export function sessionMiddleware(
  sessionService: SessionService
): RequestHandler {
  return async (req: Request, res, next) => {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(401).json({ error: "Token manquant" });
      }

      const parts = authorization.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ error: "Format de token invalide" });
      }

      const token = parts[1];

      const session = await sessionService.findActiveSession(token);

      if (!session || !session.user) {
        return res.status(401).json({ error: "Session invalide ou expirée" });
      }

      req.session = session;
      req.user = session.user as User;
      next();
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la vérification de la session" });
    }
  };
}
