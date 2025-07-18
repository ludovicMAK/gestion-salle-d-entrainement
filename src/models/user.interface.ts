import { Types } from 'mongoose';
import {Timestamps} from "./timestamps";

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    OWNER = 'owner',
    USER = 'user',
    // Compatibility with existing roles
    ADMIN = 'ADMIN',
    EMPLOYEE = 'EMPLOYEE'
}

export function getUserRoleLevel(role: UserRole): number {
    switch (role) {
        case UserRole.SUPER_ADMIN:
        case UserRole.ADMIN:
            return 999;
        case UserRole.OWNER:
        case UserRole.EMPLOYEE:
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
    // Compatibility fields
    lastName?: string;
    firstName?: string;
    password?: string;
    // Timestamps (optional)
    createdAt?: Date;
    updatedAt?: Date;
}