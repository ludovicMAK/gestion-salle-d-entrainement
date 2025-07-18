import {Mongoose, Model} from "mongoose";
import { Bar } from "../../../models";
import {barSchema} from "../schema";

export type CreateBar = Omit<Bar, '_id' | 'createdAt' | 'updatedAt'>;

export class BarService {

    readonly barModel: Model<Bar>;

    constructor(public readonly connection: Mongoose) {
        this.barModel = connection.model('Bar', barSchema());
    }

    async createBar(bar: CreateBar): Promise<Bar> {
        return this.barModel.create(bar);
    }
}