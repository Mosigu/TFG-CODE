import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateUserTaskDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  taskId?: string;

  @IsOptional()
  @IsEnum(['assigned', 'reviewer'])
  role?: string;
}
