import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

/**
 * Datos para cambiar el estado de una tarea.
 */
@InputType()
export class ChangeTaskStatusInput {
  /** Identificador de la tarea. */
  @Field(() => ID)
  @IsUUID()
  id: string;

  /** Nuevo estado de la tarea. */
  @Field(() => TaskStatus)
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
