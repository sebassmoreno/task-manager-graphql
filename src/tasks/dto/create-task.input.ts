import { Field, ID, InputType } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

/**
 * Datos necesarios para crear una tarea.
 */
@InputType()
export class CreateTaskInput {
  /** Titulo de la tarea. */
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  /** Descripcion de la tarea. */
  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  /** Estado inicial (por defecto, TODO). */
  @Field(() => TaskStatus, { defaultValue: TaskStatus.TODO })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  /** Etiquetas iniciales, sin duplicados. */
  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags: string[];

  /** Identificador del usuario asignado. */
  @Field(() => ID)
  @IsUUID()
  assignedUserId: string;

  /** Identificador del proyecto. */
  @Field(() => ID)
  @IsUUID()
  projectId: string;
}
