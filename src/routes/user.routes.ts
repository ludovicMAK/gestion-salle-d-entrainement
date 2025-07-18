import { Router } from 'express';
import { UserController } from '../controllers';
import { sessionMiddleware, roleMiddleware } from '../middlewares';
import { UserRole } from '../models';

export const userRoutes = (userController: UserController): Router => {
    const router = Router();

    // Routes CRUD de base
    router.post('/', 
        sessionMiddleware(userController.sessionService),
        roleMiddleware(UserRole.OWNER),
        userController.createUser.bind(userController)
    );
    
    router.get('/', 
        sessionMiddleware(userController.sessionService),
        roleMiddleware(UserRole.OWNER),
        userController.getUsers.bind(userController)
    );
    
    router.get('/:id', 
        sessionMiddleware(userController.sessionService),
        roleMiddleware(UserRole.OWNER),
        userController.getUser.bind(userController)
    );
    
    router.put('/:id', 
        sessionMiddleware(userController.sessionService),
        roleMiddleware(UserRole.OWNER),
        userController.updateUser.bind(userController)
    );
    
    router.delete('/:id', 
        sessionMiddleware(userController.sessionService),
        roleMiddleware(UserRole.OWNER),
        userController.deleteUser.bind(userController)
    );
    
    // Routes spécifiques
    router.get('/role/:role', 
        sessionMiddleware(userController.sessionService),
        roleMiddleware(UserRole.OWNER),
        userController.getUsersByRole.bind(userController)
    );
    
    router.patch('/:id/actif', 
        sessionMiddleware(userController.sessionService),
        roleMiddleware(UserRole.OWNER),
        userController.toggleUserStatus.bind(userController)
    );

    return router;
};
