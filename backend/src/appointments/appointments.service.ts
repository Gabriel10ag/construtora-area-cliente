// backend/src/appointments/appointments.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { Contract } from '../contracts/contract.entity';
import { User } from '../users/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private async ensureUserExists(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  /**
   * Garante que o contrato pertence ao usuário logado
   */
  private async findUserContractOrFail(
    userId: number,
    contractId: number,
  ): Promise<Contract> {
    const contract = await this.contractsRepository.findOne({
      where: {
        id: contractId,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!contract) {
      throw new NotFoundException(
        'Contrato não encontrado para este usuário.',
      );
    }

    return contract;
  }

  async listAppointmentsForUser(userId: number): Promise<Appointment[]> {
    await this.ensureUserExists(userId);

    return this.appointmentsRepository
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.contract', 'c')
      .innerJoin('c.user', 'u')
      .where('u.id = :userId', { userId })
      .orderBy('a.scheduledFor', 'ASC')
      .getMany();
  }

  async createAppointmentForUser(
    userId: number,
    dto: CreateAppointmentDto,
  ): Promise<Appointment> {
    await this.ensureUserExists(userId);

    const contract = await this.findUserContractOrFail(userId, dto.contractId);

    const scheduledFor = new Date(dto.scheduledFor);
    if (Number.isNaN(scheduledFor.getTime())) {
      throw new ForbiddenException('Data/hora do agendamento inválida.');
    }

    const appointment = this.appointmentsRepository.create({
      contract,
      type: dto.type,
      scheduledFor,
      status: 'SCHEDULED',
      notes: dto.notes,
    });

    return this.appointmentsRepository.save(appointment);
  }

  async updateStatusForUser(
    userId: number,
    id: number,
    dto: UpdateAppointmentStatusDto,
  ): Promise<Appointment> {
    await this.ensureUserExists(userId);

    const appointment = await this.appointmentsRepository
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.contract', 'c')
      .innerJoin('c.user', 'u')
      .where('a.id = :id', { id })
      .andWhere('u.id = :userId', { userId })
      .getOne();

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado para este usuário.');
    }

    appointment.status = dto.status;
    return this.appointmentsRepository.save(appointment);
  }

  async cancelForUser(userId: number, id: number): Promise<Appointment> {
    return this.updateStatusForUser(userId, id, { status: 'CANCELLED' });
  }
}
