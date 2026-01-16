import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ collection: "users" })
export class User {
  _id: any;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, select: false }) // Don't return by default
  hashedRefreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Ensure _id is kept and virtual id is removed
UserSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret: any) => {
    delete ret.__v;
    delete ret.id;
    delete ret.password;
    return ret;
  },
});