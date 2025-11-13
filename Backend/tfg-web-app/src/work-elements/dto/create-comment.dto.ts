import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  authorId: string;

  @IsOptional()
  @IsString()
  taskId?: string;
}
