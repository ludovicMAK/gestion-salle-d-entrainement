import App from './app';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gestion-salle-entrainement';

async function bootstrap() {
    const app = new App();
    
    try {
        await app.connectToDatabase(MONGO_URI);
        app.listen(Number(PORT));
    } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
}

bootstrap();
