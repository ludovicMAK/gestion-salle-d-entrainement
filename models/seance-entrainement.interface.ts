import { Types } from 'mongoose';

export interface ExerciceSeance {
    exercice: Types.ObjectId;
    repetitions?: number;
    series?: number;
    poids?: number; // en kg
    dureeMinutes?: number;
    calories?: number;
}

export interface SeanceEntrainement {
    _id?: Types.ObjectId;
    utilisateur: Types.ObjectId;
    salle?: Types.ObjectId;
    date: Date;
    dureeMinutes: number;
    caloriesBrulees: number;
    exercices: ExerciceSeance[];
    description?: string;
    defi?: Types.ObjectId;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
