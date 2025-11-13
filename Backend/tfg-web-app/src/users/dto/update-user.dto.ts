import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

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
