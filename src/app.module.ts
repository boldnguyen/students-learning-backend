import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseProviders } from './infrastructure/persistences/database.provider';
import { dashboardProviders } from './domain/dashboard.provider';
import { AuthController } from './api/controllers/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetTokenQueryHandler } from './application/usecases/auth/queries/GetTokenQuery';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './api/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RegisterUserCommandHandler } from './application/usecases/auth/commands/RegisterUserCommand';
import { ImportController } from './api/controllers/import.controller';
import { ImportCourseCommandHandler } from './application/usecases/import/commands/ImportCourseCommand';
import { ImportClassCommandHandler } from './application/usecases/import/commands/ImportClassCommand';
import { ImportUpdateClassCommandHandler } from './application/usecases/import/commands/ImportUpdateClassCommand';
import { DashboardController } from './api/controllers/dashboard.controller';
import { ImportClassReportCommandHandler } from './application/usecases/import/commands/ImportClassReportCommand';

const queryHandler = [GetTokenQueryHandler];
const commandHandler = [
  RegisterUserCommandHandler,
  ImportCourseCommandHandler,
  ImportClassCommandHandler,
  ImportUpdateClassCommandHandler,
  ImportClassReportCommandHandler,
];

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      global: true,
      secret: 'THISISSECRETKEY',
      signOptions: { expiresIn: '60d' },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    ImportController,
    DashboardController,
  ],
  providers: [
    AppService,
    ...DatabaseProviders,
    ...dashboardProviders,
    ...queryHandler,
    ...commandHandler,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [...DatabaseProviders],
})
export class AppModule {}
