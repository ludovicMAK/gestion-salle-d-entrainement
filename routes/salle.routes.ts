import { Router } from 'express';
import { SalleController } from '../controllers';

export const salleRoutes = (salleController: SalleController): Router => {
    const router = Router();

    // Routes pour les salles
    router.post('/', salleController.createSalle.bind(salleController));
    router.get('/', salleController.getSalles.bind(salleController));
    router.get('/:id', salleController.getSalle.bind(salleController));
    router.put('/:id', salleController.updateSalle.bind(salleController));
    router.delete('/:id', salleController.deleteSalle.bind(salleController));
    
    // Routes spécifiques
    router.patch('/:id/approve', salleController.approveSalle.bind(salleController));
    router.get('/owner/:ownerId', salleController.getSallesByOwner.bind(salleController));
    router.post('/search/equipments', salleController.searchSallesByEquipments.bind(salleController));

    return router;
};
