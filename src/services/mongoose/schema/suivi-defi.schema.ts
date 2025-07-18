import { Schema } from "mongoose";
import { SuiviDefi, ProgressionDefi } from "../../../models";

export function suiviDefiSchema(): Schema<SuiviDefi> {
    return new Schema<SuiviDefi>({
        utilisateur: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        defi: {
            type: Schema.Types.ObjectId,
            ref: 'Defi',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        calories: {
            type: Number
        },
        progression: {
            type: String,
            enum: Object.values(ProgressionDefi),
            required: true
        },
        notePerso: {
            type: String
        }
    }, {
        timestamps: true,
        collection: "suiviDefis",
        versionKey: false,
    });
}
