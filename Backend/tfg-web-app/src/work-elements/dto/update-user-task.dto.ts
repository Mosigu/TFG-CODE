import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserTaskDto {
  @IsOptional()
  @IsEnum(['assigned', 'reviewer'])
  role?: string;
}
