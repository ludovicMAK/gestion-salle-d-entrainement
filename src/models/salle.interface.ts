import { Types } from 'mongoose';

export interface Salle {
    _id?: Types.ObjectId;
    nom: string;
    adresse: string;
    capacite: number;
    description: string;
    equipements: string[];
    niveaux: string[];
    approuvee: boolean;
    owner: Types.ObjectId;
    typesExercices: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}
