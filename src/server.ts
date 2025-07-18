import dotenv from "dotenv";
dotenv.config();

import App from "./app";

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

async function bootstrap() {
  const app = new App();

  try {
    if (!MONGO_URI) throw new Error("MONGO_URI is missing");
    await app.connectToDatabase(MONGO_URI);
    app.listen(Number(PORT));
  } catch (err) {
    console.error("❌ Erreur lors du démarrage du serveur :", err);
    process.exit(1);
  }
}

bootstrap();
