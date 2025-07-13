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

import { salleRoutes } from './salle.routes';
import { exerciceRoutes } from './exercice.routes';
import { defiRoutes } from './defi.routes';
import { seanceRoutes } from './seance-entrainement.routes';
import { suiviDefiRoutes } from './suivi-defi.routes';
import { exerciceTypeRoutes, badgeRoutes } from './misc.routes';

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
}

export const createRoutes = (controllers: Controllers): Router => {
    const router = Router();

    // API version prefix
    const apiV1 = Router();

    // Authentication routes
    // apiV1.use('/auth', authRoutes(controllers.authController));

    // Resource routes
    apiV1.use('/salles', salleRoutes(controllers.salleController));
    apiV1.use('/exercices', exerciceRoutes(controllers.exerciceController));
    apiV1.use('/exercice-types', exerciceTypeRoutes(controllers.exerciceTypeController));
    apiV1.use('/defis', defiRoutes(controllers.defiController));
    apiV1.use('/seances', seanceRoutes(controllers.seanceController));
    apiV1.use('/suivi-defis', suiviDefiRoutes(controllers.suiviDefiController));
    apiV1.use('/badges', badgeRoutes(controllers.badgeController));
    // apiV1.use('/users', userRoutes(controllers.userController));

    // Mount API v1 under /api/v1
    router.use('/api/v1', apiV1);

    return router;
};
