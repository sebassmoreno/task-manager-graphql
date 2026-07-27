import { registerEnumType } from '@nestjs/graphql';

/**
 * Estados posibles de una tarea dentro del tablero.
 */
export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Estados posibles de una tarea dentro del tablero.',
});
