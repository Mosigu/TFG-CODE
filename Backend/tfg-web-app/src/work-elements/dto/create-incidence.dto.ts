import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateIncidenceDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  taskId: string;

  @IsOptional()
  @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
  status?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority?: string;
}
