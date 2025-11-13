import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../users/jwt.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';

@Controller('activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.createActivity(createActivityDto);
  }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activityService.getAllActivities({
      userId,
      entityType,
      entityId,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.getActivityById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    throw new Error('Not implemented');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityService.deleteActivity(id);
  }
}
