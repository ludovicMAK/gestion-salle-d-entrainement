import { Router } from 'express';
import { ExerciceController } from '../controllers';

export const exerciceRoutes = (exerciceController: ExerciceController): Router => {
    const router = Router();

    // Routes CRUD de base
    router.post('/', exerciceController.createExercice.bind(exerciceController));
    router.get('/', exerciceController.getExercices.bind(exerciceController));
    router.get('/:id', exerciceController.getExercice.bind(exerciceController));
    router.put('/:id', exerciceController.updateExercice.bind(exerciceController));
    router.delete('/:id', exerciceController.deleteExercice.bind(exerciceController));
    
    // Routes spécifiques
    router.patch('/:id/activate', exerciceController.activateExercice.bind(exerciceController));
    router.patch('/:id/deactivate', exerciceController.deactivateExercice.bind(exerciceController));
    router.get('/type/:typeId', exerciceController.getExercicesByType.bind(exerciceController));
    router.get('/niveau/:niveau', exerciceController.getExercicesByNiveau.bind(exerciceController));
    router.post('/search/muscles', exerciceController.searchExercicesByMuscles.bind(exerciceController));
    router.post('/search/equipments', exerciceController.searchExercicesByEquipments.bind(exerciceController));

    return router;
};
