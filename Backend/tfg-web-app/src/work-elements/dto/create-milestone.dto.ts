import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateMilestoneDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  taskId: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
