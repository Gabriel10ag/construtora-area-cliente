import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Occurrence } from './occurrence.entity';
import { OccurrencesController } from './occurrences.controller';
import { OccurrencesService } from './occurrences.service';
import { User } from '../users/user.entity';
import { Unit } from '../units/unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Occurrence, User, Unit])],
  controllers: [OccurrencesController],
  providers: [OccurrencesService],
  exports: [OccurrencesService],
})
export class OccurrencesModule {}
