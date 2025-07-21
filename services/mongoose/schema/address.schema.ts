import {Schema} from "mongoose";
import {Address} from "../../../models";

export function addressSchema(): Schema<Address> {
    return new Schema<Address>({
        rue: {
            type: String,
            required: true
        },
        ville: {
            type: String,
            required: true
        },
        codePostal: {
            type: String,
            required: true
        },
        pays: {
            type: String,
            required: true,
            default: 'France'
        }
    }, {
        timestamps: true,
        collection: "addresses",
        versionKey: false,
    });
}