import { Model, Types,Mongoose } from "mongoose";
import { gymSchema } from "../schema";
import { Gym } from "../../../models";

export type CreateGym = Omit<Gym, '_id' | 'createdAt' | 'updatedAt'>;
export class GymService {
  readonly gymModel: Model<Gym>;

  constructor(public readonly connection: Mongoose) {
    this.gymModel = connection.model("Gym", gymSchema());
  }

  async create(gym: CreateGym): Promise<Gym> {
   
    return this.gymModel.create(gym);
  }

  async findById(id: string | Types.ObjectId): Promise<Gym | null> {
    return await this.gymModel
      .findById(id)
      .populate("owner", "firstName lastName email")
      .populate("exerciseTypes", "name description")
      .exec();
  }

  async findAll(filter: Partial<Gym> = {}): Promise<Gym[]> {
    return await this.gymModel
      .find(filter)
      .populate("owner", "firstName lastName email")
      .populate("exerciseTypes", "name description")
      .exec();
  }

  async findByOwner(ownerId: string | Types.ObjectId): Promise<Gym[]> {
    return await this.gymModel
      .find({ owner: ownerId })
      .populate("exerciseTypes", "name description")
      .exec();
  }

  async findApproved(): Promise<Gym[]> {
    return await this.gymModel
      .find({ isApproved: true })
      .populate("owner", "firstName lastName email")
      .populate("exerciseTypes", "name description")
      .exec();
  }

  async update(
    id: string | Types.ObjectId,
    updateData: Partial<Gym>
  ): Promise<Gym | null> {
    return await this.gymModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("owner", "firstName lastName email")
      .populate("exerciseTypes", "name description")
      .exec();
  }

  async delete(id: string | Types.ObjectId): Promise<Gym | null> {
    return await this.gymModel.findByIdAndDelete(id).exec();
  }

  async approve(id: string | Types.ObjectId): Promise<Gym | null> {
    return await this.update(id, { isApproved: true });
  }

  async updateApproval(
    id: string | Types.ObjectId,
    isApproved: boolean
  ): Promise<Gym | null> {
    return await this.update(id, { isApproved });
  }

  async searchByEquipments(equipements: string[]): Promise<Gym[]> {
    return await this.gymModel
      .find({
        equipments: { $in: equipements },
        isApproved: true,
      })
      .populate("owner", "firstName lastName email")
      .populate("exerciseTypes", "name description")
      .exec();
  }
}
