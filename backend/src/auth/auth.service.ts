import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Login usando DOCUMENTO ao invés de e-mail
   */
  async validateUser(document: string, password: string): Promise<User> {
    const user = await this.usersService.findByDocument(document);

    if (!user) {
      throw new UnauthorizedException('Documento ou senha incorretos.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo.');
    }

    const passwordHash =
      (user as any).passwordHash || (user as any).password_hash;

    if (!passwordHash) {
      throw new UnauthorizedException('Usuário sem senha cadastrada.');
    }

    const passwordOk = await bcrypt.compare(password, passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException('Documento ou senha incorretos.');
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      document: user.document,
      name: user.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        document: user.document,
      },
    };
  }
}
