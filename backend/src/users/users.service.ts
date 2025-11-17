import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 🔍 Buscar por ID
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // 🔍 Buscar por e-mail (se ainda usar em algum lugar)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // 🔍 Buscar por documento (login principal)
  async findByDocument(document: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { document } });
  }

  // 🔍 Listar todos os usuários
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // ➕ Criar usuário genérico (recebe o objeto pronto)
  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  // ➕ Criar usuário a partir de name/email/password (usado no controller)
  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      passwordHash,
      isActive: true,
    });

    return this.userRepository.save(user);
  }

  // ✏ Atualizar usuário
  async update(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  // ❌ Remover usuário
  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
