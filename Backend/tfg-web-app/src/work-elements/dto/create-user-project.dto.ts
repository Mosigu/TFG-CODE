import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateUserProjectDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  projectId: string;

  @IsEnum(['admin', 'member', 'viewer'])
  role: string;
}
