import {Mongoose, Model, FilterQuery, isValidObjectId} from "mongoose";
import {User, UserRole} from "../../../models";
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

    async findUser(email: string, password?: string): Promise<User | null> {
        const filter: FilterQuery<User> = {email: email};
        if(password) {
            filter.password = sha256(password);
        }
        return this.userModel.findOne(filter);
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

}