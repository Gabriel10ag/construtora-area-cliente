import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CommonArea } from './common-area.entity';
import { CommonAreaReservation } from './common-area-reservation.entity';
import { CreateCommonAreaDto } from './dto/create-common-area.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { User } from '../users/user.entity';
import { Unit } from '../units/unit.entity';

@Injectable()
export class CommonAreasService {
  constructor(
    @InjectRepository(CommonArea)
    private readonly commonAreaRepo: Repository<CommonArea>,
    @InjectRepository(CommonAreaReservation)
    private readonly reservationRepo: Repository<CommonAreaReservation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Unit)
    private readonly unitRepo: Repository<Unit>,
  ) {}

  // ÁREAS

  createArea(dto: CreateCommonAreaDto) {
    const area = this.commonAreaRepo.create(dto);
    return this.commonAreaRepo.save(area);
  }

  findAllAreas() {
    return this.commonAreaRepo.find();
  }

  async findAreaById(id: number) {
    const area = await this.commonAreaRepo.findOne({ where: { id } });
    if (!area) throw new NotFoundException('Área comum não encontrada.');
    return area;
  }

  async updateArea(id: number, dto: Partial<CreateCommonAreaDto>) {
    const area = await this.findAreaById(id);
    Object.assign(area, dto);
    return this.commonAreaRepo.save(area);
  }

  async deleteArea(id: number) {
    const area = await this.findAreaById(id);
    return this.commonAreaRepo.remove(area);
  }

  // RESERVAS

  async createReservation(userId: number, dto: CreateReservationDto) {
    const area = await this.findAreaById(dto.commonAreaId);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const unit = await this.unitRepo.findOne({ where: { id: dto.unitId } });
    if (!unit) throw new NotFoundException('Unidade não encontrada.');

    const start = new Date(dto.startDateTime);
    const end = new Date(dto.endDateTime);

    if (end <= start) {
      throw new BadRequestException('Data/hora final deve ser maior que a inicial.');
    }

    // Regra simples: contar quantas reservas aprovadas + pendentes no dia
    const dayStart = new Date(start);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(start);
    dayEnd.setHours(23, 59, 59, 999);

    const count = await this.reservationRepo.count({
      where: {
        commonArea: { id: area.id },
        startDateTime: Between(dayStart, dayEnd),
        status: 'approved',
      },
    });

    if (count >= area.maxReservationsPerDay) {
      throw new BadRequestException('Limite de reservas para esse dia já foi atingido.');
    }

    const reservation = this.reservationRepo.create({
      commonArea: area,
      user,
      unit,
      startDateTime: start,
      endDateTime: end,
      notes: dto.notes,
      status: 'pending',
    });

    return this.reservationRepo.save(reservation);
  }

  findReservationsByUser(userId: number) {
    return this.reservationRepo.find({
      where: { user: { id: userId } },
      order: { startDateTime: 'DESC' },
    });
  }

  findReservationsByArea(areaId: number) {
    return this.reservationRepo.find({
      where: { commonArea: { id: areaId } },
      order: { startDateTime: 'DESC' },
    });
  }

  async updateReservationStatus(
    id: number,
    dto: UpdateReservationStatusDto,
  ) {
    const reservation = await this.reservationRepo.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada.');
    }

    reservation.status = dto.status;
    if (dto.notes) {
      reservation.notes = dto.notes;
    }

    return this.reservationRepo.save(reservation);
  }
}
