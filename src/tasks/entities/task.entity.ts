import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { TaskStatus } from '../enums/task-status.enum';

/**
 * Tarea de un proyecto de desarrollo de software.
 */
@ObjectType()
export class Task {
  /** Identificador unico de la tarea. */
  @Field(() => ID)
  id: string;

  /** Titulo de la tarea. */
  @Field()
  title: string;

  /** Descripcion de la tarea. */
  @Field()
  description: string;

  /** Estado actual dentro del tablero. */
  @Field(() => TaskStatus)
  status: TaskStatus;

  /** Etiquetas asociadas a la tarea. */
  @Field(() => [String])
  tags: string[];

  /** Fecha de creacion. */
  @Field()
  createdAt: Date;

  /** Fecha de la ultima modificacion. */
  @Field()
  updatedAt: Date;

  /** Usuario asignado (resuelto en el resolver). */
  @Field(() => User)
  assignedUser?: User;

  /** Proyecto al que pertenece (resuelto en el resolver). */
  @Field(() => Project)
  project?: Project;

  /** Identificador interno del usuario asignado (no expuesto en el esquema). */
  assignedUserId: string;

  /** Identificador interno del proyecto (no expuesto en el esquema). */
  projectId: string;
}
