import { Query, Resolver } from '@nestjs/graphql';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';

/**
 * Resolver GraphQL para consultar proyectos.
 */
@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  /** Devuelve la lista de proyectos. */
  @Query(() => [Project], { name: 'projects' })
  findAll(): Promise<Project[]> {
    return this.projectsService.findAll();
  }
}
