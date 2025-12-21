import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class CommentDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsNumber()
  news_id: number;

  @IsNumber()
  user_id: number;

  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  created_at?: string;
}

export class CreateNewsDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsNumber()
  author_id: number;

  @IsString()
  @IsOptional()
  created_at?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  @IsOptional()
  comments?: CommentDto[];
}

export class UpdateNewsDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsNumber()
  @IsOptional()
  author_id?: number;

  @IsString()
  @IsOptional()
  created_at?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  @IsOptional()
  comments?: CommentDto[];
}

export class AddCommentDto {
  @IsNumber()
  user_id: number;

  @IsString()
  text: string;
}
