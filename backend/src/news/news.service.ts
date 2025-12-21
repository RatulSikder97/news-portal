import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AddCommentDto, CreateNewsDto, UpdateNewsDto } from "./dto/news.dto";
import { News, NewsDocument } from "./schemas/news.schema";

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
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    query?: string,
    sort: string = "id",
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

    // Build sort object
    const sortOrder = order === "asc" ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sort]: sortOrder };

    const [data, total] = await Promise.all([
      this.newsModel.find(filter).sort(sortObj).skip(skip).limit(limit).exec(),
      this.newsModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async findOne(id: number): Promise<News> {
    const news = await this.newsModel.findOne({ id }).exec();
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return news;
  }

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    // Auto-generate ID if not provided
    if (!createNewsDto.id) {
      const lastNews = await this.newsModel.findOne().sort({ id: -1 }).exec();
      createNewsDto.id = lastNews ? lastNews.id + 1 : 1;
    }

    // Set created_at if not provided
    if (!createNewsDto.created_at) {
      createNewsDto.created_at = new Date().toISOString();
    }

    // Initialize comments if not provided
    if (!createNewsDto.comments) {
      createNewsDto.comments = [];
    }

    const createdNews = new this.newsModel(createNewsDto);
    return createdNews.save();
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
    const updatedNews = await this.newsModel
      .findOneAndUpdate({ id }, updateNewsDto, { new: true })
      .exec();
    if (!updatedNews) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return updatedNews;
  }

  async remove(id: number): Promise<void> {
    const result = await this.newsModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
  }

  async addComment(
    newsId: number,
    addCommentDto: AddCommentDto
  ): Promise<News> {
    const news = await this.findOne(newsId);

    // Generate new comment ID
    const lastCommentId = news.comments.reduce(
      (max, comment) => Math.max(max, comment.id),
      0
    );

    const newComment = {
      id: lastCommentId + 1,
      news_id: newsId,
      user_id: addCommentDto.user_id,
      text: addCommentDto.text,
      created_at: new Date().toISOString(),
    };

    const updatedNews = await this.newsModel
      .findOneAndUpdate(
        { id: newsId },
        { $push: { comments: newComment } },
        { new: true }
      )
      .exec();

    return updatedNews;
  }

  async removeComment(newsId: number, commentId: number): Promise<News> {
    const updatedNews = await this.newsModel
      .findOneAndUpdate(
        { id: newsId },
        { $pull: { comments: { id: commentId } } },
        { new: true }
      )
      .exec();

    if (!updatedNews) {
      throw new NotFoundException(`News with ID ${newsId} not found`);
    }

    return updatedNews;
  }
}
