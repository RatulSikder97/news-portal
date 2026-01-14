import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";
import { User } from "../../users/schemas/user.schema";
// import { News } from "./news.schema"; // Circular dependency risk if not careful, but usually okay with ref string

export type CommentDocument = Comment & Document;

@Schema({ collection: "comments" })
export class Comment {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'News', required: true })
  news_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  created_at: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret: any) => {
    delete ret.__v;
    delete ret.id;
    return ret;
  },
});
