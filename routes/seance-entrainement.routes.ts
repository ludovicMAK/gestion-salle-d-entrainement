import { Router } from 'express';
import { SeanceEntrainementController } from '../controllers';

export const seanceRoutes = (seanceController: SeanceEntrainementController): Router => {
    const router = Router();

    // Routes CRUD de base
    router.post('/', seanceController.createSeance.bind(seanceController));
    router.get('/', seanceController.getSeances.bind(seanceController));
    router.get('/:id', seanceController.getSeance.bind(seanceController));
    router.put('/:id', seanceController.updateSeance.bind(seanceController));
    router.delete('/:id', seanceController.deleteSeance.bind(seanceController));
    
    // Routes spécifiques
    router.get('/user/:userId', seanceController.getSeancesByUser.bind(seanceController));
    router.get('/salle/:salleId', seanceController.getSeancesBySalle.bind(seanceController));
    router.get('/defi/:defiId', seanceController.getSeancesByDefi.bind(seanceController));
    router.get('/stats/:userId', seanceController.getUserStats.bind(seanceController));
    router.get('/period/range', seanceController.getSeancesByDateRange.bind(seanceController));

    return router;
};
