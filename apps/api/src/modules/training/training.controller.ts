import { Controller, Get, Param, Query } from '@nestjs/common';
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

  @Get('courses/:id')
  @ApiOperation({ summary: '获取课程详情' })
  async findCourseById(@Param('id') id: string) {
    return this.trainingService.findCourseById(id);
  }

  @Get('mentors')
  @ApiOperation({ summary: '获取导师列表' })
  async findMentors(@Query() query: any) {
    return this.trainingService.findMentors(query);
  }

  @Get('mentors/:id')
  @ApiOperation({ summary: '获取导师详情' })
  async findMentorById(@Param('id') id: string) {
    return this.trainingService.findMentorById(id);
  }
}
