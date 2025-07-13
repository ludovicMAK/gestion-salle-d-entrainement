import { Types } from 'mongoose';

export enum DifficulteDefi {
    FACILE = 'facile',
    MOYEN = 'moyen',
    DIFFICILE = 'difficile'
}

export enum StatutDefi {
    ACTIF = 'actif',
    TERMINE = 'termine'
}

export interface ObjectifsDefi {
    repetitions?: number;
    calories?: number;
    dureeMinutes?: number;
}

export interface Defi {
    _id?: Types.ObjectId;
    titre: string;
    description: string;
    exercices: Types.ObjectId[];
    difficulte: DifficulteDefi;
    objectifs: ObjectifsDefi;
    salle: Types.ObjectId;
    createur: Types.ObjectId;
    participants: Types.ObjectId[];
    statut: StatutDefi;
    createdAt?: Date;
    updatedAt?: Date;
}
