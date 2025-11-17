import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { document: string; password: string }) {
    const { document, password } = body;
    const user = await this.authService.validateUser(document, password);
    return this.authService.login(user);
  }
}
