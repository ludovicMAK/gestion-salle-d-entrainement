import { Schema } from "mongoose";
import { Badge } from "../../../models";

export function badgeSchema(): Schema<Badge> {
    return new Schema<Badge>({
        nom: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        icone: {
            type: String,
            required: true
        },
        points: {
            type: Number,
            required: true,
            default: 0
        },
        category: {
            type: String,
            required: false
        }
    }, {
        timestamps: true,
        collection: "badges",
        versionKey: false,
    });
}
