import {Schema} from "mongoose";
import { User, UserRole } from "../../../models";

export function userSchema(): Schema<User> {
    return new Schema<User>({
        lastName: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: Object.values(UserRole)
        },
        gym: {
            type: Schema.Types.ObjectId,
            ref: 'Gym',
            required: function() {
                return this.role === UserRole.USER; // Obligatoire seulement pour les utilisateurs normaux
            }
        },
        actif: {
            type: Boolean,
            default: true
        },
        score: {
            type: Number,
            default: 0
        },
        badges: [{
            type: Schema.Types.ObjectId,
            ref: 'Badge'
        }]
    }, {
        timestamps: true, // createdAt + updatedAt
        collection: "users",
        versionKey: false, // désactive le versionning de model
    });
}