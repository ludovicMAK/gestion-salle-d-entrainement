import { Schema } from "mongoose";
import { Salle } from "../../../models";

export function salleSchema(): Schema<Salle> {
    return new Schema<Salle>({
        nom: {
            type: String,
            required: true
        },
        adresse: {
            type: String,
            required: true
        },
        capacite: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        equipements: [{
            type: String
        }],
        niveaux: [{
            type: String,
            enum: ['débutant', 'intermédiaire', 'avancé']
        }],
        approuvee: {
            type: Boolean,
            default: false
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        typesExercices: [{
            type: Schema.Types.ObjectId,
            ref: 'ExerciceType'
        }]
    }, {
        timestamps: true,
        collection: "salles",
        versionKey: false,
    });
}
