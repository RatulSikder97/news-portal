import { Type } from "class-transformer";
import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class CommentDto {
  @IsMongoId()
  @IsOptional()
  _id?: string;

  @IsMongoId()
  news_id: string;

  @IsMongoId()
  user_id: string;

  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  created_at?: string;
}

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  body: string;



  @IsString()
  @IsOptional()
  created_at?: string;
}

export class UpdateNewsDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  body?: string;



  @IsString()
  @IsOptional()
  created_at?: string;
}

export class AddCommentDto {


  @IsString()
  text: string;
}
