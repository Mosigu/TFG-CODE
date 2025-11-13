import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class UpdateIncidenceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
  status?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority?: string;

  @IsOptional()
  @IsDateString()
  resolvedAt?: string;
}
