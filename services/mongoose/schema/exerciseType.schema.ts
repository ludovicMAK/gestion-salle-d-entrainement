import {Schema} from "mongoose";
import { ExerciseType } from "../../../models/exerciseType.interface";

export function exerciseTypeSchema(): Schema<ExerciseType> {
    return new Schema<ExerciseType>({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        muscleGroups: {
            type: [String],
            required: true
        }
    }, {
        timestamps: true, // createdAt + updatedAt
        collection: "exerciseTypes",
        versionKey: false, // désactive le versionning de model
    });
}
