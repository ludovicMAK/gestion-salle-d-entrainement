import { Router } from 'express';
import { DefiController } from '../controllers';

export const defiRoutes = (defiController: DefiController): Router => {
    const router = Router();

    // Routes CRUD de base
    router.post('/', defiController.createDefi.bind(defiController));
    router.get('/', defiController.getDefis.bind(defiController));
    router.get('/:id', defiController.getDefi.bind(defiController));
    router.put('/:id', defiController.updateDefi.bind(defiController));
    router.delete('/:id', defiController.deleteDefi.bind(defiController));
    
    // Routes spécifiques
    router.patch('/:id/terminate', defiController.terminateDefi.bind(defiController));
    router.post('/:id/join', defiController.joinDefi.bind(defiController));
    router.post('/:id/leave', defiController.leaveDefi.bind(defiController));
    router.get('/creator/:creatorId', defiController.getDefisByCreator.bind(defiController));
    router.get('/salle/:salleId', defiController.getDefisBySalle.bind(defiController));
    router.get('/difficulte/:difficulte', defiController.getDefisByDifficulte.bind(defiController));

    return router;
};
