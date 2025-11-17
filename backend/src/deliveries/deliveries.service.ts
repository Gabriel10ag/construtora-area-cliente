import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from './delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { Unit } from '../units/unit.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,
    @InjectRepository(Unit)
    private readonly unitRepo: Repository<Unit>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateDeliveryDto) {
    const unit = await this.unitRepo.findOne({ where: { id: dto.unitId } });
    if (!unit) {
      throw new NotFoundException('Unidade não encontrada.');
    }

    let recipient: User | undefined = undefined;

    if (dto.recipientId) {
      const foundRecipient = await this.userRepo.findOne({
        where: { id: dto.recipientId },
      });

      if (!foundRecipient) {
        throw new NotFoundException('Morador não encontrado.');
      }

      recipient = foundRecipient;
    }

    const delivery = this.deliveryRepo.create({
      unit,
      recipient,
      description: dto.description,
      carrier: dto.carrier,
      status: 'pending',
    });

    return this.deliveryRepo.save(delivery);
  }

  findAll() {
    return this.deliveryRepo.find({
      order: { createdAt: 'DESC' as any },
    });
  }

  findByUnit(unitId: number) {
    return this.deliveryRepo.find({
      where: { unit: { id: unitId } as any },
      order: { createdAt: 'DESC' as any },
    });
  }

  async findById(id: number) {
    const delivery = await this.deliveryRepo.findOne({ where: { id } });
    if (!delivery) {
      throw new NotFoundException('Encomenda não encontrada.');
    }
    return delivery;
  }

  async updateStatus(id: number, dto: UpdateDeliveryStatusDto) {
    const delivery = await this.findById(id);

    delivery.status = dto.status as any;

    if (dto.status === 'picked_up') {
      delivery.pickedUpAt = new Date();
    }

    return this.deliveryRepo.save(delivery);
  }
}
