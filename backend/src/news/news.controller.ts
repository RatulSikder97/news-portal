import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { AddCommentDto, CreateNewsDto, UpdateNewsDto } from "./dto/news.dto";
import { NewsService } from "./news.service";

@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async findAll(
    @Query("_page") page: string = "1",
    @Query("_limit") limit: string = "10",
    @Query("q") query?: string,
    @Query("_sort") sort: string = "id",
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

    // Set X-Total-Count header for pagination (like json-server)
    if (res) {
      res.setHeader("X-Total-Count", total.toString());
    }

    return data;
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.newsService.findOne(id);
  }

  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateNewsDto: UpdateNewsDto
  ) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.newsService.remove(id);
  }

  // Comment endpoints
  @Post(":id/comments")
  addComment(
    @Param("id", ParseIntPipe) id: number,
    @Body() addCommentDto: AddCommentDto
  ) {
    return this.newsService.addComment(id, addCommentDto);
  }

  @Delete(":id/comments/:commentId")
  removeComment(
    @Param("id", ParseIntPipe) id: number,
    @Param("commentId", ParseIntPipe) commentId: number
  ) {
    return this.newsService.removeComment(id, commentId);
  }
}
