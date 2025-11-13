import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ActivityModule } from 'src/activity/activity.module';
import { WorkElementsService } from './work-elements.service';
import { WorkElementsController } from './work-elements.controller';

@Module({
  imports: [PrismaModule, ActivityModule],
  controllers: [WorkElementsController],
  providers: [WorkElementsService],
})
export class WorkElementsModule {}
