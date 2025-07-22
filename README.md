# TNESS - Gestion de salle d'entrainement
TNess est une application de gestion de salle d'entrainement, permettant aux utilisateurs de s'inscrire, de se connecter et de gérer leurs sessions d'entrainement. L'application utilise Node.js avec Express pour le backend et MongoDB pour la base de données.

## Installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/tness.git
   cd tness
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez les variables d'environnement dans un fichier `.env` :
   ```env
   SUPER_ROOT_EMAIL=root@mail.com
   SUPER_ROOT_PASSWORD=Root1234
   MONGO_URI=mongodb://appuser:apppassword@localhost:27018/tness
   MONGO_INITDB_ROOT_USERNAME=admin
   MONGO_INITDB_ROOT_PASSWORD=admin
   MONGO_PORT=27018
   MONGO_DB_NAME=tness

   PORT=3000

   JWT_SECRET=votre_secret_super_secure
   JWT_EXPIRES_IN=15d

   APP_NAME=Tness
   APP_VERSION=1.0.0
   ```
4. Démarrez l'application :
   ```bash
   npm run build
   npm run dev
   ```
5. Accédez à l'application via `http://localhost:3000`.

## Première exécution
Lors de la première exécution, un utilisateur root sera créé avec les informations suivantes (selon le fichier `.env`):
```json
{
  "email": "root@mail.com",
  "password": "Root1234"
}
```