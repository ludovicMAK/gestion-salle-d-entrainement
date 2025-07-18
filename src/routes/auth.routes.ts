import { Router, json } from "express";
import { AuthController } from "../controllers";
import { sessionMiddleware } from "../middlewares";
import { SessionService } from "../services/mongoose/services";

export const authRoutes = (
  authController: AuthController,
  sessionService: SessionService
): Router => {
  const router = Router();

  // Middleware JSON à appliquer aux routes POST
  router.use(json());

  // ✅ Routes publiques (pas besoin de token)
  router.post("/login", authController.login.bind(authController));
  router.post("/register", authController.register.bind(authController));

  // ✅ Routes protégées (requièrent le token dans Authorization)
  router.post(
    "/logout",
    sessionMiddleware(sessionService), // <== Middleware manquant avant
    authController.logout.bind(authController)
  );
  router.get(
    "/me",
    sessionMiddleware(sessionService),
    authController.me.bind(authController)
  );

  router.get("/sessions", authController.listSessions.bind(authController));

  return router;
};
