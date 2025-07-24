import { Schema } from "mongoose";
import { Defi } from "../../../models";

export function defiSchema(): Schema<Defi> {
    return new Schema<Defi>({
        exercise: { type: Schema.Types.ObjectId, ref: 'ExerciseType', required: true },
        numberOfRepetitions: { type: Number, required: true },
        creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
        name: { type: String, required: true },
        description: { type: String, required: false },
        type: { type: String, enum: ['SOCIAL', 'GYM'], required: true },
        gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: false }, 
        durationDays: { type: Number, required: false }, 
        difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], required: false },
        recommendedEquipment: [{ type: Schema.Types.ObjectId, ref: 'Equipment' }],
    }, {
        timestamps: true,
        collection: "defis",
        versionKey: false,
     });
} 