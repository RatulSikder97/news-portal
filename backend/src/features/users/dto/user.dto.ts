import { IsEmail, IsMongoId, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsMongoId()
  @IsOptional()
  _id?: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
