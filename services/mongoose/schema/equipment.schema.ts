import { Schema } from "mongoose";
import { Equipment } from "../../../models/equipment.interface";

export function equipmentSchema(): Schema<Equipment> {
    return new Schema<Equipment>({
        name: { type: String, required: true },
        description: { type: String, default: '' },
        muscleGroups: { type: [String], required: true },
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: false }
    }, {
        timestamps: true,
        collection: "equipments",
        versionKey: false,
    });
}
