import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { User } from 'src/domain/interfaces/user.interface';
import * as ExcelJS from 'exceljs';
import { Major } from 'src/domain/interfaces/major.interface';
import { Course } from 'src/domain/interfaces/course.interface';
import { Schedule } from 'src/domain/interfaces/schedule.interface';
import { Class } from 'src/domain/interfaces/class.interface';

export class ImportCourseCommand {
  constructor(public readonly buffer: Buffer) {}
}

@CommandHandler(ImportCourseCommand)
export class ImportCourseCommandHandler
  implements ICommandHandler<ImportCourseCommand>
{
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    @Inject('MAJOR_MODEL')
    private majorModel: Model<Major>,
    @Inject('COURSE_MODEL')
    private courseModel: Model<Course>,
    @Inject('SCHEDULE_MODEL')
    private scheduleModel: Model<Schedule>,
    @Inject('CLASS_MODEL')
    private classModel: Model<Class>,
  ) {}

  /**
   * Hàm import data course bằng buffer file
   * @param command model tạo tài khoản
   */
  async execute(command: ImportCourseCommand): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(command.buffer);

    const worksheet = workbook.getWorksheet(1);
    // const data = [];

    const checkMajor = [];
    worksheet.eachRow(async (row) => {
      // Assuming each row contains a single column with data
      //   data.push(row.getCell(1).value);
      const className = row.getCell(5).value.toString();
      // kiểm tra xem data có phải của ngành IT hay không
      if (className.toString().startsWith('IT')) {
        const courseName = row.getCell(2).value.toString();
        const major = className?.substr(2, 2);
        const semester = className?.substr(6, 2);
        const score = row.getCell(6).value.toString();
        const enroll = row.getCell(7).value.toString();
        const studentCode = row.getCell(4).value.toString();
        // check major

        if (!checkMajor.includes(major)) {
          checkMajor.push(major);
        }

        // check && insert course
        const courseDb = await this.courseModel.findOne({
          name: courseName,
          enrollment: enroll,
          semester: semester,
          major: major,
        });

        if (!courseDb) {
          const majorBackup = await this.classModel.findOne({
            name: className,
          });

          console.log(majorBackup, className);

          const createCourse = await this.courseModel.create({
            name: courseName,
            score: score,
            enrollment: enroll,
            semester: semester,
            major: major == 'IT' ? majorBackup?.major : major,
            majorBackup: majorBackup?.major || '',
          });

          await createCourse.save();
        }

        const cc = await this.scheduleModel.create({
          course: courseName,
          score: score,
          enrollment: enroll,
          studentCode: studentCode,
        });

        cc.save();
      }
    });

    // update major
    for (const iterator of checkMajor) {
      if (!(await this.majorModel.findOne({ name: iterator })))
        await this.majorModel.create({ name: iterator });
    }
  }
}
