import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateUserProjectDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsNotEmpty()
  @IsEnum(['manager', 'collaborator', 'viewer'])
  role: string;
}
