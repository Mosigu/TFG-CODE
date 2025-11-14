import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserTaskDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  role?: string;
}
