import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Comment, CommentSchema } from "./comment.schema";

export type NewsDocument = News & Document;

@Schema({ collection: "news" })
export class News {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true })
  author_id: number;

  @Prop({ required: true })
  created_at: string;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}

export const NewsSchema = SchemaFactory.createForClass(News);

// Transform output to match frontend expectations
NewsSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
