import {Schema} from "mongoose";
import {Session} from "../../../models";

export function sessionSchema(): Schema<Session> {
    return new Schema<Session>({
        expirationDate: {
            type: Date,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User', 
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }, {
        timestamps: true, 
        collection: "sessions",
        versionKey: false,
    });
}