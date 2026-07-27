import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Project } from '../entities/project.entity';

/**
 * Repositorio en memoria de proyectos, con datos de ejemplo precargados.
 */
@Injectable()
export class ProjectsRepository {
  private readonly projects: Project[] = [
    {
      id: randomUUID(),
      name: 'Plataforma interna',
      description: 'Herramientas para el equipo de desarrollo.',
    },
    {
      id: randomUUID(),
      name: 'API publica',
      description: 'Servicios expuestos a terceros.',
    },
  ];

  /** Devuelve todos los proyectos. */
  findAll(): Project[] {
    return this.projects;
  }

  /**
   * Busca un proyecto por su identificador.
   * @returns El proyecto, o `undefined` si no existe.
   */
  findById(id: string): Project | undefined {
    return this.projects.find((project) => project.id === id);
  }
}
