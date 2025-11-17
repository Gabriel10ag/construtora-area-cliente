import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { Poll } from './poll.entity';
import { PollOption } from './poll-option.entity';
import { PollVote } from './poll-vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, PollOption, PollVote])],
  controllers: [PollsController],
  providers: [PollsService],
  exports: [PollsService],
})
export class PollsModule {}
