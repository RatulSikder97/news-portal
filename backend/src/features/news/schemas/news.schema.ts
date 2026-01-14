import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";

export type NewsDocument = News & Document;

@Schema({ collection: "news" })
export class News {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  author_id: Types.ObjectId;

  @Prop({ required: true })
  created_at: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);

// Virtual for comments
NewsSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'news_id',
});

NewsSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret: any) => {
    delete ret.__v;
    delete ret.id;
    return ret;
  },
});
NewsSchema.set("toObject", { virtuals: true });
