import { Connection } from 'mongoose';
import { UserSchema } from './entities/user.entity';
import { ClassInfoSchema } from './entities/class-info.entity';
import { ClassSchema } from './entities/class.entity';
import { CourseSchema } from './entities/course.entity';
import { MajorSchema } from './entities/major.entity';
import { ReportSchema } from './entities/report.entity';
import { ScheduleSchema } from './entities/schedule.entity';

export const dashboardProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Users', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'MAJOR_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Majors', MajorSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'COURSE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Courses', CourseSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'CLASS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Classes', ClassSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'CLASS_INFO_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('ClassInfos', ClassInfoSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'REPORT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Reports', ReportSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'SCHEDULE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Schedules', ScheduleSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
