import { Types } from 'mongoose';
import { NiveauExercice } from './exercice-type.interface';

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
    niveau?: NiveauExercice;
    defi?: Types.ObjectId;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
