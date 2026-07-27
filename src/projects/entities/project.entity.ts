import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * Proyecto de desarrollo de software al que pertenecen las tareas.
 */
@ObjectType()
export class Project {
  /** Identificador unico del proyecto. */
  @Field(() => ID)
  id: string;

  /** Nombre del proyecto. */
  @Field()
  name: string;

  /** Descripcion del proyecto. */
  @Field()
  description: string;
}
