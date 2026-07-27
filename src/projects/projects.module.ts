import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsRepository } from './repositories/projects.repository';

/**
 * Modulo del dominio de proyectos.
 */
@Module({
  providers: [ProjectsService, ProjectsResolver, ProjectsRepository],
  exports: [ProjectsService],
})
export class ProjectsModule {}
