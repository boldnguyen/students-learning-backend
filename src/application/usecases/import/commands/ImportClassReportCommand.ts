import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import * as ExcelJS from 'exceljs';
import { Major } from 'src/domain/interfaces/major.interface';
import { Report } from 'src/domain/interfaces/report.interface';

export class ImportClassReportCommand {
  constructor(public readonly buffer: Buffer) {}
}

@CommandHandler(ImportClassReportCommand)
export class ImportClassReportCommandHandler
  implements ICommandHandler<ImportClassReportCommand>
{
  constructor(
    @Inject('REPORT_MODEL')
    private reportModel: Model<Report>,
    @Inject('MAJOR_MODEL')
    private majorModel: Model<Major>,
  ) {}

  /**
   * Hàm import data course bằng buffer file
   * @param command model tạo tài khoản
   */
  async execute(command: ImportClassReportCommand): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(command.buffer);

    const worksheet = workbook.getWorksheet(1);
    // const data = [];

    worksheet.eachRow(async (row) => {
      // Assuming each row contains a single column with data
      //   data.push(row.getCell(1).value);
      // kiểm tra xem data có phải của ngành IT hay không
      if (
        row.getCell(3).value.toString().startsWith('IT') &&
        row.getCell(2).value.toString() != '-1'
      ) {
        const year = row.getCell(1).value.toString();
        const semester = row.getCell(2).value.toString();
        const courseName = row.getCell(5).value.toString();
        const credit = row.getCell(6).value.toString().split(' ')[0];
        const program = row.getCell(7).value.toString();
        const major = program.substr(0, 2);
        const englishLevel = row.getCell(8).value.toString();
        const version = row.getCell(9).value.toString();
        // check major

        // check && insert course
        const checkReport = await this.reportModel.findOne({
          year: year,
          course: courseName,
          major: major,
          credit: credit,
          version: version,
          englishLevel: englishLevel,
          semester: semester,
        });

        if (!checkReport) {
          const createClass = await this.reportModel.create({
            year: year,
            course: courseName,
            major: major,
            credit: credit,
            version: version,
            englishLevel: englishLevel,
            semester: semester,
          });

          await createClass.save();
        }
      }
    });
  }
}
