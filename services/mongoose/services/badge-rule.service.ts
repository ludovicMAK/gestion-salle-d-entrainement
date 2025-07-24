import { Model, Types, Mongoose } from "mongoose";
import { BadgeRule } from "../../../models";
import { badgeRuleSchema } from "../schema";

export class BadgeRuleService {
    readonly badgeRuleModel: Model<BadgeRule>;

    constructor(public readonly connection: Mongoose) {
        this.badgeRuleModel = connection.models.BadgeRule || connection.model('BadgeRule', badgeRuleSchema());
    }

    async create(badgeRuleData: Partial<BadgeRule>): Promise<BadgeRule> {
        const badgeRule = new this.badgeRuleModel(badgeRuleData);
        return await badgeRule.save();
    }

    async findById(id: string | Types.ObjectId): Promise<BadgeRule | null> {
        return await this.badgeRuleModel.findById(id)
            .populate('badge')
            .exec();
    }

    async findAll(): Promise<BadgeRule[]> {
        return await this.badgeRuleModel.find()
            .populate('badge')
            .sort({ order: 1, createdAt: 1 })
            .exec();
    }

    async findActive(): Promise<BadgeRule[]> {
        return await this.badgeRuleModel.find({ isActive: true })
            .populate('badge')
            .sort({ order: 1, createdAt: 1 })
            .exec();
    }

    async findByCategory(category: string): Promise<BadgeRule[]> {
        return await this.badgeRuleModel.find({ category, isActive: true })
            .populate('badge')
            .sort({ order: 1, createdAt: 1 })
            .exec();
    }

    async findByBadge(badgeId: string | Types.ObjectId): Promise<BadgeRule[]> {
        return await this.badgeRuleModel.find({ badge: badgeId })
            .exec();
    }

    async findByConditionType(conditionType: string): Promise<BadgeRule[]> {
        return await this.badgeRuleModel.find({ 
            'conditions.type': conditionType,
            isActive: true 
        })
            .populate('badge')
            .exec();
    }

    async findByGym(gymId: string | Types.ObjectId): Promise<BadgeRule[]> {
        return await this.badgeRuleModel.find({ 
            'conditions.gymId': gymId,
            isActive: true 
        })
            .populate('badge')
            .exec();
    }

    async update(id: string | Types.ObjectId, updateData: Partial<BadgeRule>): Promise<BadgeRule | null> {
        return await this.badgeRuleModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('badge')
            .exec();
    }

    async delete(id: string | Types.ObjectId): Promise<BadgeRule | null> {
        return await this.badgeRuleModel.findByIdAndDelete(id).exec();
    }

    async deactivate(id: string | Types.ObjectId): Promise<BadgeRule | null> {
        return await this.badgeRuleModel.findByIdAndUpdate(
            id, 
            { isActive: false }, 
            { new: true }
        )
            .populate('badge')
            .exec();
    }

    async activate(id: string | Types.ObjectId): Promise<BadgeRule | null> {
        return await this.badgeRuleModel.findByIdAndUpdate(
            id, 
            { isActive: true }, 
            { new: true }
        )
            .populate('badge')
            .exec();
    }

} 