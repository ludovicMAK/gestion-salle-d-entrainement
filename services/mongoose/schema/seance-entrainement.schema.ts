import { Schema } from "mongoose";
import { SeanceEntrainement, NiveauExercice } from "../../../models";

const exerciceSeanceSchema = new Schema({
    exercice: {
        type: Schema.Types.ObjectId,
        ref: 'Exercice',
        required: true
    },
    repetitions: { type: Number },
    series: { type: Number },
    poids: { type: Number }, // en kg
    dureeMinutes: { type: Number },
    calories: { type: Number }
}, { _id: false });

export function seanceEntrainementSchema(): Schema<SeanceEntrainement> {
    return new Schema<SeanceEntrainement>({
        utilisateur: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        salle: {
            type: Schema.Types.ObjectId,
            ref: 'Salle'
        },
        date: {
            type: Date,
            default: Date.now
        },
        dureeMinutes: {
            type: Number,
            required: true
        },
        caloriesBrulees: {
            type: Number,
            required: true
        },
        exercices: [exerciceSeanceSchema],
        description: {
            type: String
        },
        niveau: {
            type: String,
            enum: Object.values(NiveauExercice)
        },
        defi: {
            type: Schema.Types.ObjectId,
            ref: 'Defi'
        },
        notes: {
            type: String
        }
    }, {
        timestamps: true,
        collection: "seancesEntrainement",
        versionKey: false,
    });
}
