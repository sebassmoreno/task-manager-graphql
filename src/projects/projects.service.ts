import { Injectable } from '@nestjs/common';
import { LogExecution } from '../common/aop/decorators/log-execution.decorator';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';
import { Project } from './entities/project.entity';
import { ProjectsRepository } from './repositories/projects.repository';

/**
 * Logica de negocio asociada a los proyectos.
 */
@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  /** Devuelve todos los proyectos. */
  @LogExecution()
  async findAll(): Promise<Project[]> {
    return this.projectsRepository.findAll();
  }

  /**
   * Busca un proyecto por su identificador.
   * @throws EntityNotFoundException si el proyecto no existe.
   */
  findById(id: string): Project {
    const project = this.projectsRepository.findById(id);
    if (!project) {
      throw new EntityNotFoundException('Project', id);
    }
    return project;
  }
}
