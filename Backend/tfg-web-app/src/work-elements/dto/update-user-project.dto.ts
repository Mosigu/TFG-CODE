import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserProjectDto {
  @IsOptional()
  @IsEnum(['manager', 'contributor', 'viewer'])
  role?: string;
}
