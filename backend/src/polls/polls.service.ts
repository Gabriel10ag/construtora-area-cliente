// backend/src/polls/polls.service.ts
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  In,
  MoreThan,
  IsNull,
} from 'typeorm';
import { Poll } from './poll.entity';
import { PollOption } from './poll-option.entity';
import { PollVote } from './poll-vote.entity';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollsRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private readonly optionsRepository: Repository<PollOption>,
    @InjectRepository(PollVote)
    private readonly votesRepository: Repository<PollVote>,
  ) {}

  /**
   * Lista enquetes ativas para o usuário.
   */
  async listActivePollsForUser(userId: number) {
    const now = new Date();

    const polls = await this.pollsRepository.find({
      where: [
        { status: 'OPEN', expiresAt: IsNull() },
        { status: 'OPEN', expiresAt: MoreThan(now) },
      ],
      order: { createdAt: 'DESC' },
    });

    if (!polls.length) {
      return [];
    }

    const pollIds = polls.map((p) => p.id);

    // Votos do usuário nessas enquetes
    const userVotes = await this.votesRepository.find({
      where: { userId, pollId: In(pollIds) },
    });

    const voteByPoll = new Map<number, PollVote>();
    userVotes.forEach((v) => {
      voteByPoll.set(v.pollId, v);
    });

    // Contagem de votos por opção
    const rawCounts = await this.votesRepository
      .createQueryBuilder('v')
      .select('v.option_id', 'optionId')
      .addSelect('COUNT(*)', 'count')
      .where('v.poll_id IN (:...pollIds)', { pollIds })
      .groupBy('v.option_id')
      .getRawMany();

    const countByOption = new Map<number, number>();
    rawCounts.forEach((row: any) => {
      countByOption.set(Number(row.optionId), Number(row.count));
    });

    return polls.map((poll) => ({
      id: poll.id,
      title: poll.title,
      description: poll.description,
      status: poll.status,
      expiresAt: poll.expiresAt,
      options: (poll.options || [])
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((opt) => ({
          id: opt.id,
          label: opt.label,
          sortOrder: opt.sortOrder,
          votes: countByOption.get(opt.id) ?? 0,
        })),
      userVoteOptionId: voteByPoll.get(poll.id)?.optionId ?? null,
    }));
  }

  /**
   * Votar (ou alterar voto) em uma enquete.
   */
  async vote(userId: number, pollId: number, optionId: number) {
    const poll = await this.pollsRepository.findOne({
      where: { id: pollId },
      relations: ['options'],
    });

    if (!poll || poll.status !== 'OPEN') {
      throw new BadRequestException('Votação não disponível.');
    }

    if (poll.expiresAt && poll.expiresAt < new Date()) {
      throw new BadRequestException('Esta votação já foi encerrada.');
    }

    const validOption = (poll.options || []).find((o) => o.id === optionId);
    if (!validOption) {
      throw new BadRequestException('Opção inválida para esta votação.');
    }

    let vote = await this.votesRepository.findOne({
      where: { userId, pollId },
    });

    if (!vote) {
      vote = this.votesRepository.create({
        userId,
        pollId,
        optionId,
      });
    } else {
      vote.optionId = optionId;
    }

    await this.votesRepository.save(vote);

    return { success: true };
  }
}
