import { Router } from 'express';
import { SuiviDefiController } from '../controllers';

export const suiviDefiRoutes = (suiviController: SuiviDefiController): Router => {
    const router = Router();

    // Routes CRUD de base
    router.post('/', suiviController.createSuivi.bind(suiviController));
    router.get('/', suiviController.getSuivis.bind(suiviController));
    router.get('/:id', suiviController.getSuivi.bind(suiviController));
    router.put('/:id', suiviController.updateSuivi.bind(suiviController));
    router.delete('/:id', suiviController.deleteSuivi.bind(suiviController));
    
    // Routes spécifiques
    router.patch('/:id/progression', suiviController.updateProgression.bind(suiviController));
    router.get('/user/:userId', suiviController.getSuivisByUser.bind(suiviController));
    router.get('/defi/:defiId', suiviController.getSuivisByDefi.bind(suiviController));
    router.get('/user/:userId/defi/:defiId', suiviController.getSuivisByUserAndDefi.bind(suiviController));
    router.get('/progression/:progression', suiviController.getSuivisByProgression.bind(suiviController));
    router.get('/stats/:defiId', suiviController.getProgressionStats.bind(suiviController));

    return router;
};
