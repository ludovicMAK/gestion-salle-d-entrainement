import { Schema } from "mongoose";
import { DefiSuivi } from "../../../models";

export function defiSuiviSchema(): Schema<DefiSuivi> {
    return new Schema<DefiSuivi>({
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        defi: { type: Schema.Types.ObjectId, ref: 'Defi', required: true },
        status: { 
            type: String, 
            enum: ['ACTIVE', 'COMPLETED', 'FAILED', 'ABANDONED'], 
            required: true,
            default: 'ACTIVE'
        },
        startDate: { type: Date, required: true, default: Date.now },
        endDate: { type: Date, required: false },
        currentRepetitions: { type: Number, required: true, default: 0 },
        targetRepetitions: { type: Number, required: true },
        progressPercentage: { type: Number, required: true, default: 0, min: 0, max: 100 },
        pointsEarned: { type: Number, required: false, default: 0 },
        badgesEarned: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
        notes: { type: String, required: false },
        lastActivity: { type: Date, required: false, default: Date.now }
    }, {
        timestamps: true,
        collection: "defi-suivis",
        versionKey: false,
    });
} 