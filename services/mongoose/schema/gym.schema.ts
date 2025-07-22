import { Schema } from "mongoose";
import { Gym } from "../../../models";

export function gymSchema(): Schema<Gym> {
    return new Schema<Gym>({
        name: { type: String, required: true },
        description: { type: String, default: '' },
        address: { type: String, required: true },
        phone: { type: String, default: '' },
        email: { type: String, default: '' },
        capacity: { type: Number, required: true },
        equipments: [{ type: Schema.Types.ObjectId, ref: 'Equipment' }],
        exerciseTypes: [{ type: Schema.Types.ObjectId, ref: 'ExerciseType' }],
        difficultyLevels: [{ 
            type: String, 
            enum: ['beginner', 'intermediate', 'advanced', 'Débutant', 'Intermédiaire', 'Avancé'] 
        }],
        isApproved: { type: Boolean, default: false },
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    }, {
        timestamps: true,
        collection: "salles",
        versionKey: false,
    });
}
