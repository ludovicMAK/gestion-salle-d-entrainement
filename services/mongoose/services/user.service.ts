import {Mongoose, Model, FilterQuery, isValidObjectId} from "mongoose";
import { User, UserRole } from "../../../models";
import {userSchema} from "../schema";
import {sha256} from "../../../utils";

// omit permet d'enlever des clés d'un type pour en créer un nouveau
export type CreateUser = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;

export class UserService {

    readonly userModel: Model<User>;

    constructor(public readonly connection: Mongoose) {
        // Check if model already exists to avoid overwrite error
        this.userModel = connection.models.User || connection.model('User', userSchema());
    }

   async findUser(email: string, password?: string): Promise<Omit<User, 'password'> | null> {
        const filter: FilterQuery<User> = { email };
        if (password) {
            filter.password = sha256(password);
        }

        const userDoc = await this.userModel.findOne(filter);
        if (!userDoc) return null;

        const { password: _, ...userSansPassword } = userDoc.toObject();
        return userSansPassword;
    }


    async createUser(user: CreateUser): Promise<User> {
        if (!user.password) {
            throw new Error('Password is required');
        }
        return this.userModel.create({...user, password: sha256(user.password)});
    }

    async updateRole(userId: string, role: UserRole): Promise<void> {
        if(!isValidObjectId(userId)) {
            return;
        }
        await this.userModel.updateOne({
            _id: userId
        }, {
            role: role
        });
    }

    async getUsers(): Promise<User[]> {
        return this.userModel.find().sort({ createdAt: -1 });
    }

    async getUser(userId: string): Promise<User | null> {
        if(!isValidObjectId(userId)) {
            return null;
        }
        return this.userModel.findById(userId);
    }

    async updateUser(userId: string, updateData: Partial<User>): Promise<User | null> {
        if(!isValidObjectId(userId)) {
            return null;
        }
        if (updateData.password) {
            updateData.password = sha256(updateData.password);
        }
        return this.userModel.findByIdAndUpdate(userId, updateData, { new: true });
    }

    async deleteUser(userId: string): Promise<boolean> {
        if(!isValidObjectId(userId)) {
            return false;
        }
        const result = await this.userModel.findByIdAndDelete(userId);
        return result !== null;
    }

    async getUsersByRole(role: string): Promise<User[]> {
        return this.userModel.find({ role }).sort({ createdAt: -1 });
    }

    async toggleUserStatus(userId: string, actif: boolean): Promise<User | null> {
        if(!isValidObjectId(userId)) {
            return null;
        }
        return this.userModel.findByIdAndUpdate(userId, { actif }, { new: true });
    }

}