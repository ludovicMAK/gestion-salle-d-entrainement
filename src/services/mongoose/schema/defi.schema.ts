import { Schema } from "mongoose";
import { Defi, DifficulteDefi, StatutDefi } from "../../../models";

const objectifsDefiSchema = new Schema({
    repetitions: { type: Number },
    calories: { type: Number },
    dureeMinutes: { type: Number }
}, { _id: false });

export function defiSchema(): Schema<Defi> {
    return new Schema<Defi>({
        titre: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        exercices: [{
            type: Schema.Types.ObjectId,
            ref: 'Exercice'
        }],
        difficulte: {
            type: String,
            enum: Object.values(DifficulteDefi),
            required: true
        },
        objectifs: {
            type: objectifsDefiSchema,
            required: true
        },
        salle: {
            type: Schema.Types.ObjectId,
            ref: 'Salle',
            required: true
        },
        createur: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        participants: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        statut: {
            type: String,
            enum: Object.values(StatutDefi),
            default: StatutDefi.ACTIF
        }
    }, {
        timestamps: true,
        collection: "defis",
        versionKey: false,
    });
}
