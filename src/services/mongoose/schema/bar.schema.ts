import {Schema} from "mongoose";
import {Bar} from "../../../models";
import {addressSchema} from "./address.schema";

export function barSchema(): Schema<Bar> {
    return new Schema<Bar>({
        name: {
            type: String,
            required: true
        },
        address: {
            type: addressSchema(),
            required: true
        },
        phone: {
            type: String
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User', // nom du model à charger
            required: true
        }
    }, {
        timestamps: true, // createdAt + updatedAt
        collection: "bars",
        versionKey: false, // désactive le versionning de model
    });
}