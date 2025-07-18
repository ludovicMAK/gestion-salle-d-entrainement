import { Router } from 'express';
import { UserController } from '../controllers';

export const userRoutes = (userController: UserController): Router => {
    const router = Router();

    // Routes CRUD de base
    router.post('/', userController.createUser.bind(userController));
    router.get('/', userController.getUsers.bind(userController));
    router.get('/:id', userController.getUser.bind(userController));
    router.put('/:id', userController.updateUser.bind(userController));
    router.delete('/:id', userController.deleteUser.bind(userController));
    
    // Routes spécifiques
    router.get('/role/:role', userController.getUsersByRole.bind(userController));
    router.patch('/:id/actif', userController.toggleUserStatus.bind(userController));

    return router;
};
