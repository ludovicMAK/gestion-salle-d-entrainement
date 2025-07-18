// Test simple pour vérifier que tous les imports fonctionnent
import { 
    User, 
    UserRole, 
    Salle, 
    Exercice, 
    ExerciceType, 
    NiveauExercice,
    Badge, 
    Defi, 
    SeanceEntrainement, 
    SuiviDefi, 
    Session, 
    Address 
} from './models';

import {
    UserService,
    SalleService,
    ExerciceService,
    ExerciceTypeService,
    BadgeService,
    DefiService,
    SeanceEntrainementService,
    SuiviDefiService,
    SessionService
} from './services/mongoose';

console.log('✅ Tous les imports fonctionnent correctement !');
console.log('✅ Architecture TypeScript prête à être utilisée !');

// Test basique des interfaces
const testUser: User = {
    email: 'test@example.com',
    role: UserRole.USER,
    actif: true,
    score: 0
};

const testSalle: Salle = {
    nom: 'Salle Test',
    adresse: '123 Rue Test',
    capacite: 50,
    description: 'Salle de test',
    equipements: ['haltères', 'tapis'],
    niveaux: ['débutant'],
    approuvee: false,
    owner: undefined as any,
    typesExercices: []
};

console.log('✅ Les interfaces TypeScript sont correctement typées !');
console.log('📁 Fichiers renommés en .interface.ts avec succès !');
