import { Schema } from "mongoose";
import { ExerciceType } from "../../../models";

export function exerciceTypeSchema(): Schema<ExerciceType> {
    return new Schema<ExerciceType>({
        nom: {
            type: String,
            required: true
        },
        description: {
            type: String
        }
    }, {
        timestamps: true,
        collection: "exerciceTypes",
        versionKey: false,
    });
}
