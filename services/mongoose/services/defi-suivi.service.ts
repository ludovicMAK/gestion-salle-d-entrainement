import { Model, Types, Mongoose } from "mongoose";
import { DefiSuivi } from "../../../models";
import { defiSuiviSchema } from "../schema";

export class DefiSuiviService {
    readonly defiSuiviModel: Model<DefiSuivi>;

    constructor(public readonly connection: Mongoose) {
        this.defiSuiviModel = connection.models.DefiSuivi || connection.model('DefiSuivi', defiSuiviSchema());
    }

    async create(defiSuiviData: Partial<DefiSuivi>): Promise<DefiSuivi> {
        const defiSuivi = new this.defiSuiviModel(defiSuiviData);
        return await defiSuivi.save();
    }

    async findById(id: string | Types.ObjectId): Promise<DefiSuivi | null> {
        return await this.defiSuiviModel.findById(id)
            .populate('user', 'firstName lastName email')
            .populate('defi')
            .populate('badgesEarned')
            .exec();
    }

    async findAll(): Promise<DefiSuivi[]> {
        return await this.defiSuiviModel.find()
            .populate('user', 'firstName lastName email')
            .populate('defi')
            .populate('badgesEarned')
            .exec();
    }

    async findByUser(userId: string | Types.ObjectId): Promise<DefiSuivi[]> {
        return await this.defiSuiviModel.find({ user: userId })
            .populate('defi')
            .populate('badgesEarned')
            .exec();
    }

    async findByDefi(defiId: string | Types.ObjectId): Promise<DefiSuivi[]> {
        return await this.defiSuiviModel.find({ defi: defiId })
            .populate('user', 'firstName lastName email')
            .populate('badgesEarned')
            .exec();
    }

    async findByStatus(status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'ABANDONED'): Promise<DefiSuivi[]> {
        return await this.defiSuiviModel.find({ status })
            .populate('user', 'firstName lastName email')
            .populate('defi')
            .populate('badgesEarned')
            .exec();
    }

    async findUserActiveDefis(userId: string | Types.ObjectId): Promise<DefiSuivi[]> {
        return await this.defiSuiviModel.find({ user: userId, status: 'ACTIVE' })
            .populate('defi')
            .populate('badgesEarned')
            .exec();
    }

    async updateProgress(id: string | Types.ObjectId, currentRepetitions: number): Promise<DefiSuivi | null> {
        const defiSuivi = await this.defiSuiviModel.findById(id);
        if (!defiSuivi) return null;

        const progressPercentage = Math.min(100, (currentRepetitions / defiSuivi.targetRepetitions) * 100);
        const status = progressPercentage >= 100 ? 'COMPLETED' : defiSuivi.status;
        const endDate = status === 'COMPLETED' ? new Date() : defiSuivi.endDate;

        return await this.defiSuiviModel.findByIdAndUpdate(id, {
            currentRepetitions,
            progressPercentage,
            status,
            endDate,
            lastActivity: new Date()
        }, { new: true })
            .populate('user', 'firstName lastName email')
            .populate('defi')
            .populate('badgesEarned')
            .exec();
    }

    async update(id: string | Types.ObjectId, updateData: Partial<DefiSuivi>): Promise<DefiSuivi | null> {
        return await this.defiSuiviModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('user', 'firstName lastName email')
            .populate('defi')
            .populate('badgesEarned')
            .exec();
    }

    async delete(id: string | Types.ObjectId): Promise<DefiSuivi | null> {
        return await this.defiSuiviModel.findByIdAndDelete(id).exec();
    }

    async getLeaderboard(defiId?: string | Types.ObjectId): Promise<DefiSuivi[]> {
        const filter = defiId ? { defi: defiId, status: { $in: ['COMPLETED', 'ACTIVE'] } } : { status: { $in: ['COMPLETED', 'ACTIVE'] } };
        
        return await this.defiSuiviModel.find(filter)
            .sort({ progressPercentage: -1, pointsEarned: -1, lastActivity: -1 })
            .populate('user', 'firstName lastName email')
            .populate('defi', 'name')
            .exec();
    }

    async getUserStats(userId: string | Types.ObjectId): Promise<any> {
        const stats = await this.defiSuiviModel.aggregate([
            { $match: { user: new Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalPoints: { $sum: "$pointsEarned" }
                }
            }
        ]);

        return stats.reduce((acc, stat) => {
            acc[stat._id.toLowerCase()] = stat.count;
            acc.totalPoints = (acc.totalPoints || 0) + stat.totalPoints;
            return acc;
        }, {});
    }
} 