import {config} from "dotenv";
import express from "express";
import {openConnection, SessionService, UserService, GymService,ExerciseTypeService,EquipmentService,BadgeService, TrainingSheetService} from "./services/mongoose";
import {UserRole} from "./models";
import {AuthController, UserController, GymController,ExerciseTypeController,EquipmentController,BadgeController, TrainingSheetController} from "./controllers";
config();

async function startAPI() {
    const connection = await openConnection();
    const userService = new UserService(connection);
    const sessionService = new SessionService(connection);
    const gymService = new GymService(connection);
    const exerciseTypeService = new ExerciseTypeService(connection);
    const equipmentService = new EquipmentService(connection);
    const badgeService = new BadgeService(connection);
    const trainingSheetService = new TrainingSheetService(connection);
    await bootstrapAPI(userService);
    const app = express();
    const authController = new AuthController(userService, sessionService);
    app.use('/auth', authController.buildRouter());
    const userController = new UserController(userService, sessionService);
    app.use('/', userController.buildRouter());
    const gymController = new GymController(gymService, sessionService, userService);
    app.use('/', gymController.buildRouter());
    const exerciseTypeController = new ExerciseTypeController(sessionService, exerciseTypeService);
    app.use('/', exerciseTypeController.buildRouter());
    const equipmentController = new EquipmentController(equipmentService, sessionService, userService);
    app.use('/', equipmentController.buildRouter());
    const badgeController = new BadgeController(badgeService, sessionService);
    app.use('/', badgeController.buildRouter());
    const trainingSheetController = new TrainingSheetController(sessionService, trainingSheetService, userService);
    app.use('/', trainingSheetController.buildRouter());
    app.listen(process.env.PORT, () => console.log(`API listening on port ${process.env.PORT}...`))
}

// Vérifie si l'utilisateur root existe, sinon le crée
async function bootstrapAPI(userService: UserService) {
    if(typeof process.env.SUPER_ROOT_EMAIL === 'undefined') {
        throw new Error('SUPER_ROOT_EMAIL is not defined');
    }
    if(typeof process.env.SUPER_ROOT_PASSWORD === 'undefined') {
        throw new Error('SUPER_ROOT_PASSWORD is not defined');
    }
    const rootUser = await userService.findUser(process.env.SUPER_ROOT_EMAIL);
    if(!rootUser) { 
        await userService.createUser({
            firstName: 'root',
            lastName: 'root',
            password: process.env.SUPER_ROOT_PASSWORD,
            email: process.env.SUPER_ROOT_EMAIL,
            role: UserRole.SUPER_ADMIN
        });
    }
}

startAPI().catch(console.error);