import { Injectable } from '@nestjs/common';
import { Audit } from '../common/aop/decorators/audit.decorator';
import { LogExecution } from '../common/aop/decorators/log-execution.decorator';
import { MeasurePerformance } from '../common/aop/decorators/measure-performance.decorator';
import { AuditAction } from '../common/aop/enums/audit-action.enum';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { ChangeTaskStatusInput } from './dto/change-task-status.input';
import { CreateTaskInput } from './dto/create-task.input';
import { TaskFilterInput } from './dto/task-filter.input';
import { Task } from './entities/task.entity';
import { TasksRepository } from './repositories/tasks.repository';

/**
 * Logica de negocio del tablero de tareas.
 */
@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  /**
   * Devuelve las tareas, aplicando el filtro opcional por estado y etiquetas.
   */
  @LogExecution()
  @MeasurePerformance(150)
  async findAll(filter?: TaskFilterInput): Promise<Task[]> {
    let tasks = this.tasksRepository.findAll();
    if (filter?.status) {
      tasks = tasks.filter((task) => task.status === filter.status);
    }
    if (filter?.tags?.length) {
      tasks = tasks.filter((task) =>
        filter.tags!.every((tag) => task.tags.includes(tag)),
      );
    }
    return tasks;
  }

  /**
   * Busca una tarea por su identificador.
   * @throws EntityNotFoundException si la tarea no existe.
   */
  async findById(id: string): Promise<Task> {
    const task = this.tasksRepository.findById(id);
    if (!task) {
      throw new EntityNotFoundException('Task', id);
    }
    return task;
  }

  /**
   * Crea una tarea, validando que el usuario y el proyecto existan.
   */
  @LogExecution()
  @Audit(AuditAction.CREATE, 'Task')
  async create(input: CreateTaskInput): Promise<Task> {
    this.usersService.findById(input.assignedUserId);
    this.projectsService.findById(input.projectId);
    return this.tasksRepository.create({
      title: input.title,
      description: input.description,
      status: input.status,
      tags: [...new Set(input.tags)],
      assignedUserId: input.assignedUserId,
      projectId: input.projectId,
    });
  }

  /**
   * Cambia el estado de una tarea.
   */
  @LogExecution()
  @Audit(AuditAction.UPDATE, 'Task')
  async changeStatus(input: ChangeTaskStatusInput): Promise<Task> {
    const task = await this.findById(input.id);
    task.status = input.status;
    return this.tasksRepository.save(task);
  }

  /**
   * Anade etiquetas a una tarea, evitando duplicados.
   */
  @LogExecution()
  @Audit(AuditAction.UPDATE, 'Task')
  async addTags(id: string, tags: string[]): Promise<Task> {
    const task = await this.findById(id);
    task.tags = [...new Set([...task.tags, ...tags])];
    return this.tasksRepository.save(task);
  }

  /**
   * Elimina una tarea.
   * @throws EntityNotFoundException si la tarea no existe.
   */
  @LogExecution()
  @Audit(AuditAction.DELETE, 'Task')
  async remove(id: string): Promise<boolean> {
    await this.findById(id);
    return this.tasksRepository.delete(id);
  }
}
