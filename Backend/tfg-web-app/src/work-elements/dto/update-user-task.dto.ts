import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserTaskDto {
  @IsOptional()
  @IsEnum(['owner', 'contributor', 'reviewer'])
  role?: string;
}
