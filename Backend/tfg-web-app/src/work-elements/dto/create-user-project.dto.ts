import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserProjectDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
