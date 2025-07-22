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
    return this.gymModel
      .findById(id)
      .populate("owner", "firstName lastName email")
      .populate("exerciseTypes", "name description")
      .populate("equipments", "name description muscleGroups")
      .exec();
  }

  async findAll(filter: Partial<Gym> = {}): Promise<Gym[]> {
    return this.gymModel
      .find(filter)
      .populate("owner", "firstName lastName email")
      .populate("exerciseTypes", "name description")
      .populate("equipments", "name description muscleGroups")
      .exec();
  }

  async findByOwner(ownerId: string | Types.ObjectId): Promise<Gym[]> {
    return this.gymModel
      .find({ owner: ownerId })
      .populate("exerciseTypes", "name description")
      .populate("equipments", "name description muscleGroups")
      .exec();
  }

  async findApproved(): Promise<Gym[]> {
    return this.gymModel
      .find({ isApproved: true })
      .populate("owner", "firstName lastName email")
      .populate("exerciseTypes", "name description")
      .populate("equipments", "name description muscleGroups")
      .exec();
  }

  async update(
    id: string | Types.ObjectId,
    updateData: Partial<Gym>
  ): Promise<Gym | null> {
    return this.gymModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("owner", "firstName lastName email")
      .populate("exerciseTypes", "name description")
      .populate("equipments", "name description muscleGroups")
      .exec();
  }

  async delete(id: string | Types.ObjectId): Promise<Gym | null> {
    return this.gymModel.findByIdAndDelete(id).exec();
  }

  async approve(id: string | Types.ObjectId): Promise<Gym | null> {
    return this.update(id, { isApproved: true });
  }

  async updateApproval(
    id: string | Types.ObjectId,
    isApproved: boolean
  ): Promise<Gym | null> {
    return this.update(id, { isApproved });
  }

  async searchByEquipments(equipements: string[]): Promise<Gym[]> {
    return this.gymModel
      .find({
        equipments: { $in: equipements },
        isApproved: true,
      })
      .populate("owner", "firstName lastName email")
      .populate("exerciseTypes", "name description")
      .populate("equipments", "name description muscleGroups")
      .exec();
  }

  async addEquipmentToGym(gymId: string | Types.ObjectId, equipmentId: string | Types.ObjectId): Promise<Gym | null> {
    return this.gymModel
      .findByIdAndUpdate(
        gymId,
        { $addToSet: { equipments: equipmentId } },
        { new: true }
      )
      .populate("owner", "firstName lastName email")
      .populate("exerciseTypes", "name description")
      .populate("equipments", "name description muscleGroups")
      .exec();
  }

  async removeEquipmentFromGym(gymId: string | Types.ObjectId, equipmentId: string | Types.ObjectId): Promise<Gym | null> {
    return this.gymModel
      .findByIdAndUpdate(
        gymId,
        { $pull: { equipments: equipmentId } },
        { new: true }
      )
      .populate("owner", "firstName lastName email")
      .populate("exerciseTypes", "name description")
      .populate("equipments", "name description muscleGroups")
      .exec();
  }
}
