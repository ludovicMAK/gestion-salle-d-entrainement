import { Types } from 'mongoose';

export enum ProgressionDefi {
    EN_COURS = 'en cours',
    TERMINE = 'terminé',
    ABANDONNE = 'abandonné'
}

export interface SuiviDefi {
    _id?: Types.ObjectId;
    utilisateur: Types.ObjectId;
    defi: Types.ObjectId;
    date: Date;
    calories?: number;
    progression: ProgressionDefi;
    notePerso?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
