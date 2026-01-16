import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  Request,
} from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";
import { AddCommentDto, CreateNewsDto, UpdateNewsDto } from "./dto/news.dto";
import { NewsService } from "./news.service";

@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Get()
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("q") query?: string,
    @Query("sort") sort: string = "_id",
    @Query("order") order: "asc" | "desc" = "desc",
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const { data, total } = await this.newsService.findAll(
      pageNum,
      limitNum,
      query,
      sort,
      order
    );

    const pages = Math.ceil(total / limitNum);

    return {
      items: data,
      total,
      current_page: pageNum,
      limit: limitNum,
      pages,
      last_page: pages,
    };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.newsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createNewsDto: CreateNewsDto, @Request() req) {
    return this.newsService.create(createNewsDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @Request() req
  ) {
    return this.newsService.update(id, updateNewsDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string, @Request() req) {
    return this.newsService.remove(id, req.user.id);
  }

  // Comment endpoints
  @UseGuards(JwtAuthGuard)
  @Post(":id/comments")
  addComment(
    @Param("id") id: string,
    @Body() addCommentDto: AddCommentDto,
    @Request() req
  ) {
    return this.newsService.addComment(id, addCommentDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/comments/:commentId")
  removeComment(
    @Param("id") id: string,
    @Param("commentId") commentId: string,
    @Request() req
  ) {
    return this.newsService.removeComment(id, commentId, req.user.id);
  }
}
