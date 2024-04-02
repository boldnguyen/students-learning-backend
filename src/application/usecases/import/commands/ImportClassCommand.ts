import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import * as ExcelJS from 'exceljs';
import { Major } from 'src/domain/interfaces/major.interface';
import { Class } from 'src/domain/interfaces/class.interface';

export class ImportClassCommand {
  constructor(public readonly buffer: Buffer) {}
}

@CommandHandler(ImportClassCommand)
export class ImportClassCommandHandler
  implements ICommandHandler<ImportClassCommand>
{
  constructor(
    @Inject('CLASS_MODEL')
    private classModel: Model<Class>,
    @Inject('MAJOR_MODEL')
    private majorModel: Model<Major>,
  ) {}

  /**
   * Hàm import data course bằng buffer file
   * @param command model tạo tài khoản
   */
  async execute(command: ImportClassCommand): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(command.buffer);

    const worksheet = workbook.getWorksheet(1);
    // const data = [];

    worksheet.eachRow(async (row) => {
      // Assuming each row contains a single column with data
      //   data.push(row.getCell(1).value);
      // kiểm tra xem data có phải của ngành IT hay không
      const classId = row.getCell(2).value.toString();
      const major = row.getCell(3).value.toString();
      const version = row.getCell(4).value.toString();
      const englishLevel = row.getCell(5).value.toString();
      // check major

      const majorDb = await this.majorModel.findOne({ name: major });
      let majorId = majorDb?.id;
      if (!majorDb) {
        const createdMajor = await this.majorModel.create({ name: major });
        createdMajor.save();
        majorId = createdMajor.id;
      }
      // check && insert course
      const classDb = await this.classModel.findOne({
        name: classId,
        majorId: majorId,
        major: major,
        version: version,
        englishLevel: englishLevel,
      });

      if (!classDb) {
        const createClass = await this.classModel.create({
          name: classId,
          majorId: majorId,
          major: major,
          version: version,
          englishLevel: englishLevel,
        });

        await createClass.save();
      }
    });
  }
}
