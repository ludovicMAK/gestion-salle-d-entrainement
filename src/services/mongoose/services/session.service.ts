import {Mongoose, Model, isValidObjectId} from "mongoose";
import { Session } from "../../../models";
import {sessionSchema} from "../schema";
import crypto from 'crypto';

export type CreateSession = Omit<Session, '_id' | 'createdAt' | 'updatedAt' | 'token'>;

export class SessionService {
  readonly sessionModel: Model<Session>;

  constructor(public readonly connection: Mongoose) {
    // Check if model already exists to avoid overwrite error
    this.sessionModel =
      connection.models.Session || connection.model("Session", sessionSchema());
  }

  async createSession(session: CreateSession): Promise<Session> {
    // Générer un token aléatoirement sécurisé
    const token = crypto.randomBytes(32).toString('hex');
    
    return this.sessionModel.create({
      ...session,
      token: token
    });
  }

  async findActiveSession(token: string): Promise<Session | null> {
    if (!token || token.length === 0) {
      console.log("❌ Token vide:", token);
      return null;
    }

    try {
      const session = await this.sessionModel
        .findOne({ 
          token: token,
          expirationDate: { $gt: new Date() } // Vérifier que la session n'est pas expirée
        })
        .populate("user");

      if (!session) {
        console.log("❌ Session introuvable ou expirée pour token:", token);
      } else if (!session.user) {
        console.log("⚠️ Session trouvée mais user manquant (populate a échoué)");
      } else {
        console.log("✅ Session et utilisateur OK pour token:", token);
      }

      return session;
    } catch (error) {
      console.error("❌ Erreur lors de la recherche de session:", error);
      return null;
    }
  }

  async deleteSession(token: string): Promise<boolean> {
    if (!token || token.length === 0) {
      return false;
    }
    
    try {
      const result = await this.sessionModel.findOneAndDelete({ token: token });
      return result !== null;
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de session:", error);
      return false;
    }
  }

  async getAllSessions(): Promise<Session[]> {
    return this.sessionModel.find().populate("user");
  }
}