import {Mongoose, Model, FilterQuery, isValidObjectId} from "mongoose";
import { User, UserRole } from "../../../models";
import {userSchema} from "../schema";
import {sha256} from "../../../utils";

export type CreateUser = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;

export class UserService {

    readonly userModel: Model<User>;

    constructor(public readonly connection: Mongoose) {
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
        
        if (user.role === UserRole.USER && user.gym) {
            if (!isValidObjectId(user.gym as string)) {
                throw new Error('Invalid gym ID');
            }
            const gym = await this.connection.models.Gym.findById(user.gym);
            if (!gym) {
                throw new Error('Gym not found');
            }
            if (!gym.isApproved) {
                throw new Error('Cannot register to an unapproved gym');
            }
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
        return this.userModel.find().populate('gym', 'name address').sort({ createdAt: -1 });
    }

    async getUsersByGym(gymId: string): Promise<User[]> {
        if(!isValidObjectId(gymId)) {
            return [];
        }
        return this.userModel.find({ gym: gymId }).populate('gym', 'name address').sort({ createdAt: -1 });
    }

    async getUsersByOwner(ownerId: string): Promise<User[]> {
        if(!isValidObjectId(ownerId)) {
            return [];
        }
        const gyms = await this.connection.models.Gym.find({ owner: ownerId });
        const gymIds = gyms.map(gym => gym._id);
        
        return this.userModel.find({ gym: { $in: gymIds } }).populate('gym', 'name address').sort({ createdAt: -1 });
    }

    async getUser(userId: string): Promise<User | null> {
        if(!isValidObjectId(userId)) {
            return null;
        }
        return this.userModel.findById(userId).populate('gym', 'name address');
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

    async findById(userId: string): Promise<User | null> {
        return this.getUser(userId);
    }

    async findByIdWithBadges(userId: string): Promise<User | null> {
        if(!isValidObjectId(userId)) {
            return null;
        }
        return this.userModel.findById(userId)
            .populate('gym', 'name address')
            .populate('badges')
            .exec();
    }

    async addBadgeToUser(userId: string, badgeId: string): Promise<User | null> {
        if(!isValidObjectId(userId) || !isValidObjectId(badgeId)) {
            return null;
        }
        
        const user = await this.userModel.findById(userId);
        if (!user) return null;
        
        const userBadges = user.badges || [];
        if (userBadges.some((b: any) => b.toString() === badgeId)) {
            return user; 
        }
        
        return this.userModel.findByIdAndUpdate(
            userId, 
            { $addToSet: { badges: badgeId } }, 
            { new: true }
        ).populate('badges');
    }

}