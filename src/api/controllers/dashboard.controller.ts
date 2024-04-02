import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { Public } from '../guards/public.guard';
import { CourseSummaryDto } from '../dtos/dashboards/CourseSummaryDto';
import { Class } from 'src/domain/interfaces/class.interface';
import { Course } from 'src/domain/interfaces/course.interface';
import { Model } from 'mongoose';
import { Report } from 'src/domain/interfaces/report.interface';
import { Schedule } from 'src/domain/interfaces/schedule.interface';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject('COURSE_MODEL')
    private courseModel: Model<Course>,
    @Inject('CLASS_MODEL')
    private classModel: Model<Class>,
    @Inject('MAJOR_MODEL')
    private majorModel: Model<Class>,
    @Inject('REPORT_MODEL')
    private reportModel: Model<Report>,
    @Inject('SCHEDULE_MODEL')
    private scheduleModel: Model<Schedule>,
  ) {}

  @Public()
  @Post('course/summary')
  @ApiBody({ type: CourseSummaryDto })
  async CourseSummary(@Body() courseSummaryDto: CourseSummaryDto) {
    return await this.courseModel.aggregate([
      {
        $match: {
          major: courseSummaryDto.major,
          enrollment: courseSummaryDto.enrollment,
        },
      },
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 },
        },
      },
    ]);
  }

  @Public()
  @Post('course/avg')
  @ApiBody({ type: CourseSummaryDto })
  async AvgScoreCourse(@Body() courseSummaryDto: CourseSummaryDto) {
    return await this.courseModel.aggregate([
      {
        $match: {
          major: courseSummaryDto.major,
          enrollment: courseSummaryDto.enrollment,
        },
      },
      {
        $group: {
          _id: '$name',
          avg: { $avg: '$score' },
        },
      },
    ]);
  }

  @Public()
  @Post('get-total-student')
  @ApiBody({ type: CourseSummaryDto })
  async GetTotalStudent(@Body() courseSummaryDto: CourseSummaryDto) {
    const schedules = await this.scheduleModel.find({});

    // tìm tổng học sinh theo nghành và khóa
    const totalStudent = schedules.filter(
      (x) =>
        x.studentCode
          .toUpperCase()
          .includes(courseSummaryDto.major.toUpperCase()) &&
        x.studentCode.toUpperCase().includes(courseSummaryDto.enrollment + ''),
    ).length;

    return totalStudent;
  }

  @Public()
  @Get('course')
  async GetCourse() {
    return await this.courseModel.aggregate([
      {
        $group: {
          _id: '$name',
        },
      },
    ]);
  }

  @Public()
  @Get('course-score-by-major')
  @ApiQuery({ name: 'name', type: String })
  async ByCourseScore(@Query('name') name: string) {
    return await this.courseModel.aggregate([
      {
        $match: {
          name: name,
        },
      },
      {
        $group: {
          _id: '$major',
          avg: { $avg: '$score' },
        },
      },
    ]);
  }

  @Public()
  @Get('course-score-by-enrollment')
  @ApiQuery({ name: 'name', type: String })
  async ByCourseScoreEnroll(@Query('name') name: string) {
    return await this.courseModel.aggregate([
      {
        $match: {
          name: name,
        },
      },
      {
        $group: {
          _id: '$enrollment',
          avg: { $avg: '$score' },
        },
      },
    ]);
  }

  @Public()
  @Get('get-english-level')
  async GetEnglishLevel() {
    return await this.classModel.aggregate([
      {
        $group: {
          _id: '$englishLevel',
        },
      },
    ]);
  }

  @Public()
  @Get('get-batch')
  async GetBatch() {
    return await this.classModel.aggregate([
      {
        $group: {
          _id: '$batch',
        },
      },
    ]);
  }

  @Public()
  @Get('get-enroll')
  async GetEnroll() {
    return await this.courseModel.aggregate([
      {
        $group: {
          _id: '$enrollment',
        },
      },
    ]);
  }

  @Public()
  @Get('get-major')
  async GetMajor() {
    return await this.majorModel.aggregate([
      {
        $group: {
          _id: '$name',
        },
      },
    ]);
  }

  @Public()
  @Get('count-class-by-english-level')
  @ApiQuery({ name: 'major', type: String })
  async CountClassByEnglishLevel(@Query('major') major: string) {
    return await this.classModel.aggregate([
      {
        $match: {
          major: major,
        },
      },
      {
        $group: {
          _id: '$englishLevel',
          count: { $sum: 1 },
        },
      },
    ]);
  }

  @Public()
  @Get('count-class-by-batch')
  @ApiQuery({ name: 'major', type: String })
  async CountClassByMajor(@Query('major') major: string) {
    return await this.classModel.aggregate([
      {
        $match: {
          major: major,
        },
      },
      {
        $group: {
          _id: '$batch',
          count: { $sum: 1 },
        },
      },
    ]);
  }

  @Public()
  @Get('get-report-chart')
  @ApiQuery({ name: 'version', type: String })
  async GetReport(@Query('version') version: string) {
    return await this.reportModel.aggregate([
      {
        $match: {
          version: version,
        },
      },
      {
        $group: {
          _id: '$year',
          count: {
            $sum: 1,
          },
        },
      },
    ]);
  }

  @Public()
  @Get('get-version')
  async GetVersion() {
    return await this.reportModel.aggregate([
      {
        $group: {
          _id: '$version',
        },
      },
    ]);
  }

  @Public()
  @Get('get-new-chart')
  async GetChart(
    @Query('major') major: string,
    @Query('enroll') enroll: string,
    @Query('semester') semester: string,
    @Query('year') year: string,
  ) {
    const course = await this.reportModel.aggregate([
      {
        $match: {
          major: major,
          year: year,
          semester: semester,
        },
      },
      {
        $group: {
          _id: '$course',
        },
      },
    ]);

    const schedules = await this.scheduleModel.find({});

    // tìm tổng học sinh theo nghành và khóa
    const totalStudent = schedules.filter(
      (x) =>
        x.studentCode.toUpperCase().includes(major.toUpperCase()) &&
        x.studentCode.toUpperCase().includes(enroll.toUpperCase()),
    ).length;

    const results = course.map((x) => {
      return {
        group: x._id,
        totalStudentLearned: schedules.filter(
          (y) =>
            y.studentCode.includes(major) &&
            y.studentCode.includes(enroll) &&
            y.course.includes(x._id),
        ).length,
        totalStudent: totalStudent,
      };
    });
    return results;
  }
}
