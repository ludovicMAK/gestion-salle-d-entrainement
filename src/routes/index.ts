import { Router } from 'express';
import { 
    SalleController, 
    ExerciceController, 
    ExerciceTypeController,
    DefiController,
    SeanceEntrainementController,
    SuiviDefiController,
    BadgeController,
    UserController,
    AuthController
} from '../controllers';
import { SessionService } from '../services/mongoose/services';

import { salleRoutes } from './salle.routes';
import { exerciceRoutes } from './exercice.routes';
import { defiRoutes } from './defi.routes';
import { seanceRoutes } from './seance-entrainement.routes';
import { suiviDefiRoutes } from './suivi-defi.routes';
import { exerciceTypeRoutes, badgeRoutes } from './misc.routes';
import { userRoutes } from './user.routes';
import { authRoutes } from './auth.routes';

interface Controllers {
    salleController: SalleController;
    exerciceController: ExerciceController;
    exerciceTypeController: ExerciceTypeController;
    defiController: DefiController;
    seanceController: SeanceEntrainementController;
    suiviDefiController: SuiviDefiController;
    badgeController: BadgeController;
    userController: UserController;
    authController: AuthController;
    sessionService: SessionService;
}

export const createRoutes = (controllers: Controllers): Router => {
    const router = Router();

    // API routes
    const apiRouter = Router();

    // Authentication routes
    apiRouter.use('/auth', authRoutes(controllers.authController, controllers.sessionService));

    // Resource routes
    apiRouter.use('/salles', salleRoutes(controllers.salleController));
    apiRouter.use('/exercices', exerciceRoutes(controllers.exerciceController));
    apiRouter.use('/exercice-types', exerciceTypeRoutes(controllers.exerciceTypeController));
    apiRouter.use('/defis', defiRoutes(controllers.defiController));
    apiRouter.use('/seances', seanceRoutes(controllers.seanceController));
    apiRouter.use('/suivi-defis', suiviDefiRoutes(controllers.suiviDefiController));
    apiRouter.use('/badges', badgeRoutes(controllers.badgeController));
    apiRouter.use('/users', userRoutes(controllers.userController));

    // Mount API under /api
    router.use('/api', apiRouter);

    return router;
};
