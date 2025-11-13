import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateUserTaskDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  taskId: string;

  @IsOptional()
  @IsEnum(['owner', 'contributor', 'reviewer'])
  role?: string;
}
