import { Router } from 'express';
import { AuthController } from '../controllers';

export const authRoutes = (authController: AuthController): Router => {
    const router = Router();

    // Routes d'authentification
    router.post('/login', authController.login.bind(authController));
    router.post('/logout', authController.logout.bind(authController));
    router.post('/register', authController.register.bind(authController));
    router.get('/me', authController.me.bind(authController));

    return router;
};
