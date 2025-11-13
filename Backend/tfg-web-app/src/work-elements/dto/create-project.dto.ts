import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @IsIn(['internal', 'external'], {
    message: 'Type must be internal or external',
  })
  type?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'finished', 'on-hold'], {
    message: 'Status must be active, finished, or on-hold',
  })
  status?: string;
}
