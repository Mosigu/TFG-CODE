import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
  IsIn,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  projectId: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsString()
  @IsIn(['low', 'medium', 'high'], {
    message: 'Priority must be low, medium or high',
  })
  priority: string;
}
