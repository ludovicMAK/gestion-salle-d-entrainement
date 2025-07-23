# Modifications apportées au système de gestion des utilisateurs

## Résumé des changements

Les utilisateurs doivent maintenant s'inscrire à une salle spécifique, et l'affichage des utilisateurs est adapté selon les rôles.

## Modifications des modèles

### User Interface (`models/user.interface.ts`)
- Ajout du champ `gym?: Types.ObjectId | string` pour référencer la salle d'inscription

### User Schema (`services/mongoose/schema/user.schema.ts`)
- Ajout du champ `gym` avec référence vers le modèle `Gym`
- Le champ `gym` est obligatoire pour les utilisateurs avec le rôle `USER`
- Ajout des champs `actif`, `score`, et `badges` dans le schéma

## Modifications des services

### UserService (`services/mongoose/services/user.service.ts`)
- **Nouvelles méthodes :**
  - `getUsersByGym(gymId: string)` : Récupère les utilisateurs d'une salle spécifique
  - `getUsersByOwner(ownerId: string)` : Récupère tous les utilisateurs des salles d'un propriétaire
- **Méthodes modifiées :**
  - `createUser()` : Validation de l'existence et de l'approbation de la salle
  - `getUsers()` et `getUser()` : Ajout du populate pour afficher les informations de la salle

## Modifications des contrôleurs

### UserController (`controllers/user.controller.ts`)
- **Nouvelle méthode :**
  - `getUsersByGym()` : Endpoint pour récupérer les utilisateurs d'une salle
- **Méthodes modifiées :**
  - `createUser()` : Validation obligatoire de l'ID de salle pour les utilisateurs normaux
  - `getUsers()` : Logique d'affichage basée sur les rôles :
    - **SUPER_ADMIN** : Voit tous les utilisateurs
    - **OWNER** : Voit seulement les utilisateurs de ses salles
    - **USER** : Accès refusé
- **Routes mises à jour :**
  - Toutes les routes de lecture nécessitent maintenant une authentification
  - Ajout de la route `GET /gyms/:gymId/users`

### AuthController (`controllers/auth.controller.ts`)
- **Méthodes modifiées :**
  - `subscribe()` : Champ `gymId` obligatoire avec validation
  - `register()` : Champ `gymId` obligatoire pour les utilisateurs normaux

### GymController (`controllers/gym.controller.ts`)
- **Nouvelle méthode :**
  - `getApprovedGyms()` : Endpoint public pour lister les salles approuvées
- **Nouvelle route :**
  - `GET /gyms/approved` : Route publique pour l'inscription

## Nouvelles routes API

### Routes utilisateurs
```
GET /users                    - Liste des utilisateurs (selon rôle)
GET /users/:id               - Détails d'un utilisateur
GET /gyms/:gymId/users       - Utilisateurs d'une salle spécifique
GET /users/role/:role        - Utilisateurs par rôle
POST /users                  - Créer un utilisateur (SUPER_ADMIN)
PUT /users/:id               - Modifier un utilisateur (SUPER_ADMIN)
DELETE /users/:id            - Supprimer un utilisateur (SUPER_ADMIN)
PATCH /users/:id/promote     - Promouvoir un utilisateur (SUPER_ADMIN)
PATCH /users/:id/demote      - Rétrograder un utilisateur (SUPER_ADMIN)
PATCH /users/:id/toggle-status - Activer/désactiver (SUPER_ADMIN)
```

### Routes salles
```
GET /gyms/approved           - Salles approuvées (public)
```

### Routes d'authentification
```
POST /auth/subscribe         - Inscription (gymId requis)
POST /auth/register          - Enregistrement (gymId requis pour USER)
```

## Permissions par rôle

### SUPER_ADMIN
- Voit tous les utilisateurs de toutes les salles
- Peut créer, modifier, supprimer des utilisateurs
- Peut promouvoir/rétrograder des utilisateurs

### OWNER
- Voit seulement les utilisateurs inscrits à ses salles
- Peut voir les détails des utilisateurs de ses salles

### USER
- Ne peut pas voir la liste des utilisateurs
- Doit s'inscrire à une salle approuvée lors de l'inscription

## Validation des données

- L'ID de salle est obligatoire pour l'inscription des utilisateurs normaux
- La salle doit exister et être approuvée
- L'ID de salle doit être un ObjectId MongoDB valide

## Messages d'erreur

- `"ID de la salle requis pour l'inscription d'un utilisateur"`
- `"Salle non trouvée"`
- `"Impossible de s'inscrire à une salle non approuvée"`
- `"ID de salle invalide"`
- `"Accès refusé : vous ne pouvez voir que les utilisateurs de vos propres salles"`
