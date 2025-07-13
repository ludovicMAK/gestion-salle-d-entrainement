import express from 'express';
import mongoose from 'mongoose';
import { UserService, SessionService } from '../services/mongoose/services';
import { AuthController, UserController } from '../controllers';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initializeRoutes(): void {
        // Initialize services with mongoose connection
        const userService = new UserService(mongoose);
        const sessionService = new SessionService(mongoose);

        // Initialize controllers
        const authController = new AuthController(userService, sessionService);
        const userController = new UserController(userService, sessionService);

        // Route setup
        this.app.use('/auth', authController.buildRouter());
        this.app.use('/api/users', userController.buildRouter());
        
        // Health check route
        this.app.get('/health', (req, res) => {
            res.json({ status: 'OK', message: 'Serveur en cours d\'exécution' });
        });
    }

    public listen(port: number): void {
        this.app.listen(port, () => {
            console.log(`🚀 Serveur démarré sur le port ${port}`);
        });
    }

    public async connectToDatabase(mongoUri: string): Promise<void> {
        try {
            await mongoose.connect(mongoUri);
            console.log('✅ Connecté à MongoDB');
        } catch (error) {
            console.error('❌ Erreur de connexion à MongoDB:', error);
            process.exit(1);
        }
    }
}

export default App;
