import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonArea } from './common-area.entity';
import { CommonAreaReservation } from './common-area-reservation.entity';
import { CommonAreasController } from './common-areas.controller';
import { CommonAreasService } from './common-areas.service';
import { User } from '../users/user.entity';
import { Unit } from '../units/unit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommonArea,
      CommonAreaReservation,
      User,
      Unit,
    ]),
  ],
  controllers: [CommonAreasController],
  providers: [CommonAreasService],
  exports: [CommonAreasService],
})
export class CommonAreasModule {}
