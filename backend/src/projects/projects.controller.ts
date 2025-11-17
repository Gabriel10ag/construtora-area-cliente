import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const project = await this.projectsService.findOne(id);

    return {
      id: project.id,
      name: project.name,
      code: project.code,
      city: project.city,
      state: project.state,
      address: project.address,
      status: project.status,
      stage: project.stage,
      progressPercent: project.progressPercent,
      heroImageUrl: project.heroImageUrl,
    };
  }

  @Get(':id/updates')
  async findUpdates(@Param('id', ParseIntPipe) id: number) {
    const updates = await this.projectsService.findUpdatesByProject(id);

    return updates.map((u) => ({
      id: u.id,
      title: u.title,
      description: u.description,
      mediaUrl: u.mediaUrl,
      createdAt: u.createdAt,
    }));
  }
}
