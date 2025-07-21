import {Schema} from "mongoose";
import { Equipment } from "../../../models/equipment.interface";

export function equipmentSchema(): Schema<Equipment> {
    return new Schema<Equipment>({
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
        collection: "equipments",
        versionKey: false, // désactive le versionning de model
    });
}
