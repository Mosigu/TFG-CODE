import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  agentId: string;

  @IsEnum(['project', 'task', 'comment', 'milestone', 'incidence', 'user'])
  entityType: string;

  @IsString()
  entityId: string;

  @IsEnum([
    'CREATED',
    'UPDATED',
    'DELETED',
    'STATUS_CHANGED',
    'USER_ASSIGNED',
    'USER_REMOVED',
    'COMPLETED',
    'RESOLVED',
  ])
  action: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @IsOptional()
  @IsString()
  relatedEntityId?: string;
}
