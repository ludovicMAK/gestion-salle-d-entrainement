import {config} from "dotenv";
import express from "express";
import {openConnection, SessionService, UserService, GymService} from "./services/mongoose";
import {UserRole} from "./models";
import {AuthController, UserController, GymController} from "./controllers";
config();

async function startAPI() {
    const connection = await openConnection();
    const userService = new UserService(connection);
    const sessionService = new SessionService(connection);
    const gymService = new GymService(connection);
    await bootstrapAPI(userService);
    const app = express();
    const authController = new AuthController(userService, sessionService);
    app.use('/auth', authController.buildRouter());
    const userController = new UserController(userService, sessionService);
    app.use('/user', userController.buildRouter());
    const gymController = new GymController(gymService, sessionService, userService);
    app.use('/gym', gymController.buildRouter());
    app.listen(process.env.PORT, () => console.log(`API listening on port ${process.env.PORT}...`))
}

async function bootstrapAPI(userService: UserService) {
    if(typeof process.env.SUPER_ROOT_EMAIL === 'undefined') {
        throw new Error('SUPER_ROOT_EMAIL is not defined');
    }
    if(typeof process.env.SUPER_ROOT_PASSWORD === 'undefined') {
        throw new Error('SUPER_ROOT_PASSWORD is not defined');
    }
    const rootUser = await userService.findUser(process.env.SUPER_ROOT_EMAIL);
    if(!rootUser) { // first launch API
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