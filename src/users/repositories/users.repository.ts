import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../entities/user.entity';

/**
 * Repositorio en memoria de usuarios, con datos de ejemplo precargados.
 */
@Injectable()
export class UsersRepository {
  private readonly users: User[] = [
    { id: randomUUID(), fullName: 'Ada Lovelace', email: 'ada@example.com' },
    { id: randomUUID(), fullName: 'Alan Turing', email: 'alan@example.com' },
  ];

  /** Devuelve todos los usuarios. */
  findAll(): User[] {
    return this.users;
  }

  /**
   * Busca un usuario por su identificador.
   * @returns El usuario, o `undefined` si no existe.
   */
  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
