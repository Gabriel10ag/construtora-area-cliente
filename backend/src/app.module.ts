// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { ContractsModule } from './contracts/contracts.module';
import { FinanceModule } from './finance/finance.module';
import { DocumentsModule } from './documents/documents.module';
import { UnitsModule } from './units/units.module';
import { TicketsModule } from './tickets/tickets.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ProfileModule } from './profile/profile.module';
import { PollsModule } from './polls/polls.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'construtora_area_cliente',
      autoLoadEntities: true,
      synchronize: false,
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    ContractsModule,
    FinanceModule,
    DocumentsModule,
    UnitsModule,
    TicketsModule,
    AppointmentsModule,
    ProfileModule,
    PollsModule, // ✅ novo
  ],
})
export class AppModule {}
