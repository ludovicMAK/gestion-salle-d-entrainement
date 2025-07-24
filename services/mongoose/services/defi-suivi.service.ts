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
            .select('+endDate +lastActivity +pointsEarned')
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
        const isCompleted = progressPercentage >= 100;
        const wasCompleted = defiSuivi.status === 'COMPLETED';
        const status = isCompleted ? 'COMPLETED' : defiSuivi.status;
        
    
        const endDate = (isCompleted && !wasCompleted) ? new Date() : defiSuivi.endDate;
        
        let pointsEarned = defiSuivi.pointsEarned || 0;
        if (isCompleted && !wasCompleted) {
            pointsEarned = 100;
            
            const defi = await this.defiSuiviModel.findById(id).populate('defi').exec();
            if (defi?.defi) {
                const difficulty = (defi.defi as any).difficulty;
                switch (difficulty) {
                    case 'EASY':
                        pointsEarned += 25;
                        break;
                    case 'MEDIUM':
                        pointsEarned += 50;
                        break;
                    case 'HARD':
                        pointsEarned += 100;
                        break;
                }
            }
        }

        const updateData: any = {
            currentRepetitions,
            progressPercentage,
            status,
            pointsEarned,
            lastActivity: new Date()
        };

        if (endDate) {
            updateData.endDate = endDate;
        }

        const updatedSuivi = await this.defiSuiviModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('user', 'firstName lastName email')
            .populate('defi')
            .populate('badgesEarned')
            .exec();

        if (updatedSuivi) {
            updatedSuivi.endDate = updatedSuivi.endDate || endDate;
            updatedSuivi.pointsEarned = updatedSuivi.pointsEarned || pointsEarned;
            updatedSuivi.lastActivity = updatedSuivi.lastActivity || new Date();
        }

        return updatedSuivi;
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