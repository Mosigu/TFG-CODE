import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserProjectDto {
  @IsOptional()
  @IsEnum(['admin', 'member', 'viewer'])
  role?: string;
}
