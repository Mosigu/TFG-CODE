import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name?: string;

  @IsString()
  surname?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(['admin', 'manager', 'contributor', 'viewer'])
  role?: string;

  @IsOptional()
  @IsString()
  profilePictureURL?: string;

  @IsOptional()
  @IsString()
  managerId?: string;
}
