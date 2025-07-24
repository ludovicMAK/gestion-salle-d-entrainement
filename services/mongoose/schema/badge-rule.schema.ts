import { Schema } from "mongoose";
import { BadgeRule } from "../../../models";

export function badgeRuleSchema(): Schema<BadgeRule> {
    return new Schema<BadgeRule>({
        name: { type: String, required: true },
        description: { type: String, required: true },
        badge: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
        conditions: [{
            type: { 
                type: String, 
                enum: ['DEFI_COMPLETION', 'REPETITIONS', 'CONSECUTIVE_DAYS', 'SCORE_THRESHOLD', 'DIFFICULTY_LEVEL', 'GYM_SPECIFIC'], 
                required: true 
            },
            value: { type: Number, required: true },
            timeframe: { type: Number, required: false },
            difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], required: false },
            gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: false }
        }],
        points: { type: Number, required: true, default: 0 },
        isActive: { type: Boolean, required: true, default: true },
        category: { type: String, required: false },
        order: { type: Number, required: false, default: 0 }
    }, {
        timestamps: true,
        collection: "badge-rules",
        versionKey: false,
    });
} 