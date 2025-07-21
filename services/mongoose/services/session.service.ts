import {Mongoose, Model, isValidObjectId} from "mongoose";
import { Session } from "../../../models";
import {sessionSchema} from "../schema";
import { v4 as uuidv4 } from 'uuid';

export type CreateSession = Omit<Session, '_id' | 'createdAt' | 'updatedAt'>;

export class SessionService {

    readonly sessionModel: Model<Session>;

    constructor(public readonly connection: Mongoose) {
        this.sessionModel = connection.model('Session', sessionSchema());
    }

    async createSession(session: CreateSession): Promise<Session> {
        // Génère un token unique si non fourni
        const token = session.token || uuidv4();
        const created = await this.sessionModel.create({ ...session, token });
        return created.toObject();
    }

    async findActiveSession(sessionId: string): Promise<Session | null> {
        const session = await this.sessionModel.findOne({
            token: sessionId,
        }).populate('user');
        return session;
    }
}