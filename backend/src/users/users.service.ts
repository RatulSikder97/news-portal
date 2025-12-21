import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Auto-generate ID if not provided
    if (!createUserDto.id) {
      const lastUser = await this.userModel.findOne().sort({ id: -1 }).exec();
      createUserDto.id = lastUser ? lastUser.id + 1 : 1;
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ id }, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const result = await this.userModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
