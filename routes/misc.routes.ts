import { Router } from 'express';
import { ExerciceTypeController, BadgeController } from '../controllers';

export const exerciceTypeRoutes = (exerciceTypeController: ExerciceTypeController): Router => {
    const router = Router();

    router.post('/', exerciceTypeController.createExerciceType.bind(exerciceTypeController));
    router.get('/', exerciceTypeController.getExerciceTypes.bind(exerciceTypeController));
    router.get('/:id', exerciceTypeController.getExerciceType.bind(exerciceTypeController));
    router.put('/:id', exerciceTypeController.updateExerciceType.bind(exerciceTypeController));
    router.delete('/:id', exerciceTypeController.deleteExerciceType.bind(exerciceTypeController));

    return router;
};

export const badgeRoutes = (badgeController: BadgeController): Router => {
    const router = Router();

    router.post('/', badgeController.createBadge.bind(badgeController));
    router.get('/', badgeController.getBadges.bind(badgeController));
    router.get('/:id', badgeController.getBadge.bind(badgeController));
    router.put('/:id', badgeController.updateBadge.bind(badgeController));
    router.delete('/:id', badgeController.deleteBadge.bind(badgeController));
    router.get('/points/:minPoints', badgeController.getBadgesByPoints.bind(badgeController));

    return router;
};
