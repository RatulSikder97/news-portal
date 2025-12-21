import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
