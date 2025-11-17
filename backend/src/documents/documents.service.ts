import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepo: Repository<Document>,
  ) {}

  async findByUserId(userId: number): Promise<Document[]> {
    return this.documentsRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'contract'],
      order: { id: 'DESC' }, // antes tentava usar createdAt
    });
  }

  async findById(id: number): Promise<Document | null> {
    return this.documentsRepo.findOne({
      where: { id },
      relations: ['user', 'contract'],
    });
  }

  async createForUser(params: {
    userId: number;
    contractId: number | null;
    title: string;
    description?: string;
    fileUrl: string;
    fileType: string;
  }): Promise<Document> {
    const doc = this.documentsRepo.create({
      title: params.title,
      description: params.description ?? null,
      fileUrl: params.fileUrl,
      fileType: params.fileType,
      user: { id: params.userId } as any,
      contract: params.contractId ? ({ id: params.contractId } as any) : null,
    });

    return this.documentsRepo.save(doc);
  }
}
