import { Types } from 'mongoose';
import {Timestamps} from "./timestamps";

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    OWNER = 'OWNER',
    USER = 'USER',
}

export function getUserRoleLevel(role: UserRole): number {
    switch (role) {
        case UserRole.SUPER_ADMIN:
            return 999;
        case UserRole.OWNER:
            return 1;
        default:
            return 0;
    }
}

export interface User {
    _id?: Types.ObjectId | string;
    nom?: string;
    email: string;
    motDePasse?: string;
    role: UserRole;
    actif?: boolean;
    score?: number;
    badges?: Types.ObjectId[];
    lastName?: string;
    firstName?: string;
    password?: string;
    gym?: Types.ObjectId | string; // Référence à la salle où l'utilisateur est inscrit
    createdAt?: Date;
    updatedAt?: Date;
}