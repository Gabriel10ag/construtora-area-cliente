import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitor } from './visitor.entity';
import { Visit } from './visit.entity';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';
import { User } from '../users/user.entity';
import { Unit } from '../units/unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visitor, Visit, User, Unit])],
  controllers: [VisitorsController],
  providers: [VisitorsService],
  exports: [VisitorsService],
})
export class VisitorsModule {}
