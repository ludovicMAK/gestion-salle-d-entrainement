import { Types } from 'mongoose';
import { NiveauExercice } from './exercice-type.interface';

export interface Exercice {
    _id?: Types.ObjectId;
    nom: string;
    description: string;
    typeExercice: Types.ObjectId;
    musclesCibles: string[];
    equipements: string[];
    niveau: NiveauExercice;
    instructions: string;
    actif: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
