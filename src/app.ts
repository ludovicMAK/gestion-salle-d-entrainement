import express from 'express';
import mongoose from 'mongoose';
import { createRoutes } from './routes';
import { 
    UserService, 
    SessionService, 
    SalleService, 
    ExerciceService, 
    ExerciceTypeService,
    DefiService,
    SeanceEntrainementService,
    SuiviDefiService,
    BadgeService
} from './services/mongoose/services';
import { 
    AuthController, 
    UserController,
    SalleController,
    ExerciceController,
    ExerciceTypeController,
    DefiController,
    SeanceEntrainementController,
    SuiviDefiController,
    BadgeController
} from './controllers';
import { salleSchema, exerciceSchema, exerciceTypeSchema, defiSchema, seanceEntrainementSchema, suiviDefiSchema, badgeSchema } from './services/mongoose/schema';

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
        // Initialize models
        const SalleModel = mongoose.models.Salle || mongoose.model('Salle', salleSchema());
        const ExerciceModel = mongoose.models.Exercice || mongoose.model('Exercice', exerciceSchema());
        const ExerciceTypeModel = mongoose.models.ExerciceType || mongoose.model('ExerciceType', exerciceTypeSchema());
        const DefiModel = mongoose.models.Defi || mongoose.model('Defi', defiSchema());
        const SeanceModel = mongoose.models.SeanceEntrainement || mongoose.model('SeanceEntrainement', seanceEntrainementSchema());
        const SuiviDefiModel = mongoose.models.SuiviDefi || mongoose.model('SuiviDefi', suiviDefiSchema());
        const BadgeModel = mongoose.models.Badge || mongoose.model('Badge', badgeSchema());

        // Initialize services
        const userService = new UserService(mongoose);
        const sessionService = new SessionService(mongoose);
        const salleService = new SalleService(SalleModel);
        const exerciceService = new ExerciceService(ExerciceModel);
        const exerciceTypeService = new ExerciceTypeService(ExerciceTypeModel);
        const defiService = new DefiService(DefiModel);
        const seanceService = new SeanceEntrainementService(SeanceModel);
        const suiviDefiService = new SuiviDefiService(SuiviDefiModel);
        const badgeService = new BadgeService(BadgeModel);

        // Initialize controllers
        const authController = new AuthController(userService, sessionService);
        const userController = new UserController(userService, sessionService);
        const salleController = new SalleController(salleService);
        const exerciceController = new ExerciceController(exerciceService, exerciceTypeService);
        const exerciceTypeController = new ExerciceTypeController(exerciceTypeService);
        const defiController = new DefiController(defiService);
        const seanceController = new SeanceEntrainementController(seanceService);
        const suiviDefiController = new SuiviDefiController(suiviDefiService);
        const badgeController = new BadgeController(badgeService);

        // Create routes
        const routes = createRoutes({
            salleController,
            exerciceController,
            exerciceTypeController,
            defiController,
            seanceController,
            suiviDefiController,
            badgeController,
            userController,
            authController
        });

        // Use routes
        this.app.use(routes);
        
        // Health check route
        this.app.get('/', (req, res) => {
            res.json({ status: 'OK', message: 'Serveur en cours d\'exécution' });
        });
        
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
