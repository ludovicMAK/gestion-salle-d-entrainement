import { Types } from 'mongoose';

export enum NiveauExercice {
    DEBUTANT = 'débutant',
    INTERMEDIAIRE = 'intermédiaire',
    AVANCE = 'avancé'
}

export interface ExerciceType {
    _id?: Types.ObjectId;
    nom: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}
