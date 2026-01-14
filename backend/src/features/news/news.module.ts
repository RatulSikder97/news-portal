import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { News, NewsSchema } from "./schemas/news.schema";
import { Comment, CommentSchema } from "./schemas/comment.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: News.name, schema: NewsSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule { }
