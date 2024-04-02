import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import * as ExcelJS from 'exceljs';
import { Major } from 'src/domain/interfaces/major.interface';
import { Class } from 'src/domain/interfaces/class.interface';

export class ImportUpdateClassCommand {
  constructor(public readonly buffer: Buffer) {}
}

@CommandHandler(ImportUpdateClassCommand)
export class ImportUpdateClassCommandHandler
  implements ICommandHandler<ImportUpdateClassCommand>
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
  async execute(command: ImportUpdateClassCommand): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(command.buffer);

    const worksheet = workbook.getWorksheet(1);
    // const data = [];

    worksheet.eachRow(async (row) => {
      // Assuming each row contains a single column with data
      //   data.push(row.getCell(1).value);
      // kiểm tra xem data có phải của ngành IT hay không
      const classId = row.getCell(1).value?.toString();
      if (classId.startsWith('IT')) {
        const englishLevel = row.getCell(2).value?.toString();
        const batch = row.getCell(3).value?.toString();
        const major = row.getCell(4).value?.toString();
        // check major
        // check && insert course

        const check = await this.classModel.findOne({ name: classId });
        if (check) {
          const classDb = await this.classModel.findOneAndUpdate(
            {
              name: classId,
            },
            {
              $set: {
                batch: batch,
                englishLevelNumber: englishLevel,
                major: major,
              },
            },
          );
          await classDb?.save();
        } else {
          const create = await this.classModel.create({
            name: classId,
            major: major,
            englishLevel: englishLevel,
            batch: batch,
          });

          await create.save();
        }
      }
    });
  }
}
