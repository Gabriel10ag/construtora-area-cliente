import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PollsService } from './polls.service';
import { VoteDto } from './dto/vote.dto';

interface AuthRequest extends Request {
  user?: any;
}

@Controller('polls')
@UseGuards(JwtAuthGuard)
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  private getUserIdFromRequest(req: AuthRequest): number {
    const u: any =
      (req as any).user ??
      (req as any).request?.user ??
      (req as any).req?.user ??
      {};
    return u.userId ?? u.id ?? u.sub;
  }

  @Get()
  async list(@Req() req: AuthRequest) {
    const userId = this.getUserIdFromRequest(req);
    return this.pollsService.listActivePollsForUser(userId);
  }

  @Post(':id/vote')
  async vote(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) pollId: number,
    @Body() dto: VoteDto,
  ) {
    const userId = this.getUserIdFromRequest(req);
    return this.pollsService.vote(userId, pollId, dto.optionId);
  }
}
