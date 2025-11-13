import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateUserProjectDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsEnum(['manager', 'contributor', 'viewer'])
  role: string;
}
