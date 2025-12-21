import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CommentDocument = Comment & Document;

@Schema({ _id: false })
export class Comment {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  news_id: number;

  @Prop({ required: true })
  user_id: number;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  created_at: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
