import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Task } from '../entities/task.entity';

/**
 * Repositorio en memoria de tareas.
 */
@Injectable()
export class TasksRepository {
  private readonly tasks: Task[] = [];

  /** Devuelve todas las tareas. */
  findAll(): Task[] {
    return this.tasks;
  }

  /** Busca una tarea por su identificador. */
  findById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  /**
   * Crea una tarea a partir de sus datos, asignando id y marcas de tiempo.
   */
  create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const now = new Date();
    const task: Task = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.push(task);
    return task;
  }

  /** Persiste los cambios de una tarea existente. */
  save(task: Task): Task {
    task.updatedAt = new Date();
    return task;
  }

  /**
   * Elimina una tarea por su identificador.
   * @returns `true` si se elimino, `false` si no existia.
   */
  delete(id: string): boolean {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      return false;
    }
    this.tasks.splice(index, 1);
    return true;
  }
}
