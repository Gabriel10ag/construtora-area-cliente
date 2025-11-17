import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectUpdate } from './project-update.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    @InjectRepository(ProjectUpdate)
    private readonly updatesRepo: Repository<ProjectUpdate>,
  ) {}

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepo.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return project;
  }

  async findUpdatesByProject(projectId: number): Promise<ProjectUpdate[]> {
    return this.updatesRepo.find({
      where: { project: { id: projectId } },
      order: { createdAt: 'DESC' },
    });
  }
}
