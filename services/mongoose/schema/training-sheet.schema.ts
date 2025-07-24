import { Schema } from "mongoose";
import { TrainingSheet } from "../../../models";

export function trainingSheetSchema(): Schema<TrainingSheet> {
    return new Schema<TrainingSheet>({
        name: { type: String, required: true },
        description: { type: String, required: false },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        exercises: [{
            exercise: { type: Schema.Types.ObjectId, ref: 'ExerciseType', required: true },
            repetitions: { type: Number, required: true, min: 1 },
            sets: { type: Number, required: true, min: 1 }
        }]
    }, {
        timestamps: true,
        collection: "training-sheets",
        versionKey: false,
    });
} 