import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * Usuario al que se pueden asignar tareas.
 */
@ObjectType()
export class User {
  /** Identificador unico del usuario. */
  @Field(() => ID)
  id: string;

  /** Nombre completo del usuario. */
  @Field()
  fullName: string;

  /** Correo electronico del usuario. */
  @Field()
  email: string;
}
