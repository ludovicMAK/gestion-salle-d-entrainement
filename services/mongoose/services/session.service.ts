import {Mongoose, Model, isValidObjectId} from "mongoose";
import {Session} from "../../../models";
import {sessionSchema} from "../schema";

export type CreateSession = Omit<Session, '_id' | 'createdAt' | 'updatedAt'>;

export class SessionService {

    readonly sessionModel: Model<Session>;

    constructor(public readonly connection: Mongoose) {
        // Check if model already exists to avoid overwrite error
        this.sessionModel = connection.models.Session || connection.model('Session', sessionSchema());
    }

    async createSession(session: CreateSession): Promise<Session> {
        return this.sessionModel.create(session);
    }

    async findActiveSession(sessionId: string): Promise<Session | null> {
        if(!isValidObjectId(sessionId)) {
            return null;
        }
        const session = this.sessionModel.findOne({
            _id: sessionId,
        }).populate('user'); // populate permet de charger un objet d'une autre collection a partir de son id
        return session;
    }

    async deleteSession(sessionId: string): Promise<boolean> {
        if(!isValidObjectId(sessionId)) {
            return false;
        }
        const result = await this.sessionModel.findByIdAndDelete(sessionId);
        return result !== null;
    }
}