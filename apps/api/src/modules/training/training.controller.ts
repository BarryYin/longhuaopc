import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TrainingService } from './training.service';

@ApiTags('培训')
@Controller('training')
export class TrainingController {
  constructor(private trainingService: TrainingService) {}

  @Get('courses')
  @ApiOperation({ summary: '获取课程列表' })
  async findCourses(@Query() query: any) {
    return this.trainingService.findCourses(query);
  }

  @Get('mentors')
  @ApiOperation({ summary: '获取导师列表' })
  async findMentors(@Query() query: any) {
    return this.trainingService.findMentors(query);
  }
}
