import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AddCommentDto, CreateNewsDto, UpdateNewsDto } from "./dto/news.dto";
import { News, NewsDocument } from "./schemas/news.schema";
import { Comment, CommentDocument } from "./schemas/comment.schema";

export interface PaginatedResponse<T> {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
}

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
  ) { }

  async findAll(
    page: number = 1,
    limit: number = 10,
    query?: string,
    sort: string = "created_at",
    order: "asc" | "desc" = "desc"
  ): Promise<{ data: News[]; total: number }> {
    const skip = (page - 1) * limit;

    // Build query filter
    let filter = {};
    if (query) {
      const decodedQuery = decodeURIComponent(query);
      filter = {
        $or: [
          { title: { $regex: decodedQuery, $options: "i" } },
          { body: { $regex: decodedQuery, $options: "i" } },
        ],
      };
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sort]: sortOrder };

    const [data, total] = await Promise.all([
      this.newsModel.find(filter).sort(sortObj).skip(skip).limit(limit).populate('comments').exec(),
      this.newsModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<News> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid News ID format`);
    }
    const news = await this.newsModel.findById(id).populate('comments').exec();
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return news;
  }

  async clearCache() {
    try {
      const cacheDir = '.cache';
      const files = await import('fs/promises').then(fs => fs.readdir(cacheDir));
      const deletePromises = files
        .filter(file => file.startsWith('GET__news'))
        .map(file => import('fs/promises').then(fs => fs.unlink(`${cacheDir}/${file}`)));
      await Promise.all(deletePromises);
    } catch (e) {
      console.warn("Failed to clear cache", e);
    }
  }

  async create(createNewsDto: CreateNewsDto, userId: string): Promise<News> {
    if (!createNewsDto.created_at) {
      createNewsDto.created_at = new Date().toISOString();
    }

    const createdNews = new this.newsModel({
      ...createNewsDto,
      author_id: new Types.ObjectId(userId)
    });
    await this.clearCache();
    return createdNews.save();
  }

  async update(id: string, updateNewsDto: UpdateNewsDto, userId: string): Promise<News> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid News ID format`);
    }

    const news = await this.newsModel.findById(id).exec();
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    if (news.author_id.toString() !== userId) {
      throw new ForbiddenException("You are not authorized to update this news");
    }

    const updatedNews = await this.newsModel
      .findByIdAndUpdate(id, updateNewsDto, { new: true })
      .populate('comments')
      .exec();

    await this.clearCache();
    return updatedNews;
  }

  async remove(id: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid News ID format`);
    }

    const news = await this.newsModel.findById(id).exec();
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    if (news.author_id.toString() !== userId) {
      throw new ForbiddenException("You are not authorized to delete this news");
    }

    await this.newsModel.findByIdAndDelete(id).exec();
    await this.commentModel.deleteMany({ news_id: new Types.ObjectId(id) });
    await this.clearCache();
  }

  async addComment(
    newsId: string,
    addCommentDto: AddCommentDto,
    userId: string
  ): Promise<News> {
    const news = await this.findOne(newsId); // Validates news existence

    const newComment = new this.commentModel({
      news_id: new Types.ObjectId(newsId),
      user_id: new Types.ObjectId(userId),
      text: addCommentDto.text,
      created_at: new Date().toISOString(),
    });

    await newComment.save();
    await this.clearCache();

    return this.findOne(newsId);
  }

  async removeComment(newsId: string, commentId: string, userId: string): Promise<News> {
    if (!Types.ObjectId.isValid(newsId) || !Types.ObjectId.isValid(commentId)) {
      throw new NotFoundException(`Invalid ID format`);
    }

    const comment = await this.commentModel.findOne({ _id: commentId, news_id: newsId });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found in this news`);
    }

    if (comment.user_id.toString() !== userId) {
      throw new ForbiddenException("You are not authorized to delete this comment");
    }

    await this.commentModel.findByIdAndDelete(commentId);
    await this.clearCache();

    return this.findOne(newsId);
  }
}
