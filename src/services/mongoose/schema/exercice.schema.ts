import { Schema } from "mongoose";
import { Exercice, NiveauExercice } from "../../../models";

export function exerciceSchema(): Schema<Exercice> {
    return new Schema<Exercice>({
        nom: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        typeExercice: {
            type: Schema.Types.ObjectId,
            ref: 'ExerciceType',
            required: true
        },
        musclesCibles: [{
            type: String
        }],
        equipements: [{
            type: String
        }],
        niveau: {
            type: String,
            enum: Object.values(NiveauExercice),
            default: NiveauExercice.DEBUTANT
        },
        instructions: {
            type: String
        },
        actif: {
            type: Boolean,
            default: true
        }
    }, {
        timestamps: true,
        collection: "exercices",
        versionKey: false,
    });
}
