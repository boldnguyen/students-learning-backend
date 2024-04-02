import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Public } from '../guards/public.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportCourseCommand } from 'src/application/usecases/import/commands/ImportCourseCommand';
import { ImportClassCommand } from 'src/application/usecases/import/commands/ImportClassCommand';
import { ImportUpdateClassCommand } from 'src/application/usecases/import/commands/ImportUpdateClassCommand';
import { ImportClassReportCommand } from 'src/application/usecases/import/commands/ImportClassReportCommand';

@Controller('import')
export class ImportController {
  constructor(
    readonly commandBus: CommandBus,
    readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Post('course')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importDemo(@UploadedFile() file: Express.Multer.File) {
    return await this.commandBus.execute(new ImportCourseCommand(file.buffer));
  }

  @Public()
  @Post('class')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importClass(@UploadedFile() file: Express.Multer.File) {
    return await this.commandBus.execute(new ImportClassCommand(file.buffer));
  }

  @Public()
  @Post('class-update')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importClassUpdate(@UploadedFile() file: Express.Multer.File) {
    return await this.commandBus.execute(
      new ImportUpdateClassCommand(file.buffer),
    );
  }

  @Public()
  @Post('report')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importReport(@UploadedFile() file: Express.Multer.File) {
    return await this.commandBus.execute(
      new ImportClassReportCommand(file.buffer),
    );
  }
}
