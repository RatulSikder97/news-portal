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
    @Query("_page") page: string = "1",
    @Query("_limit") limit: string = "10",
    @Query("q") query?: string,
    @Query("_sort") sort: string = "_id",
    @Query("_order") order: "asc" | "desc" = "desc",
    @Res({ passthrough: true }) res?: Response
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

    // Set X-Total-Count header for pagination
    if (res) {
      res.setHeader("X-Total-Count", total.toString());
    }

    return data;
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
