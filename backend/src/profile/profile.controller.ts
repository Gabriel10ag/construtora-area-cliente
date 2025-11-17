// backend/src/profile/profile.controller.ts
import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface AuthRequest extends Request {
  user?: any;
}

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  private getUserIdFromRequest(req: AuthRequest): number {
    const u: any =
      (req as any).user ??
      (req as any).request?.user ??
      (req as any).req?.user ??
      {};
    return u.userId ?? u.id ?? u.sub;
  }

  @Get('me')
  async getMe(@Req() req: AuthRequest) {
    const userId = this.getUserIdFromRequest(req);
    return this.profileService.getProfile(userId);
  }

  @Patch('me')
  async updateMe(
    @Req() req: AuthRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    const userId = this.getUserIdFromRequest(req);
    return this.profileService.updateProfile(userId, dto);
  }
}
