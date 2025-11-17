// backend/src/profile/profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getProfile(userId: number): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // devolve só os campos que interessam pro perfil
    const { id, name, email, phone, document, createdAt, updatedAt } =
      user as any;

    return {
      id,
      name,
      email,
      phone,
      document,
      createdAt,
      updatedAt,
    };
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
  ): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (dto.name !== undefined) {
      (user as any).name = dto.name;
    }

    if (dto.phone !== undefined) {
      (user as any).phone = dto.phone;
    }

    if (dto.document !== undefined) {
      (user as any).document = dto.document;
    }

    await this.usersRepository.save(user);

    const { id, name, email, phone, document, createdAt, updatedAt } =
      user as any;

    return {
      id,
      name,
      email,
      phone,
      document,
      createdAt,
      updatedAt,
    };
  }
}
