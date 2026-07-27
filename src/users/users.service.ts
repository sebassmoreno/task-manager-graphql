import { Injectable } from '@nestjs/common';
import { LogExecution } from '../common/aop/decorators/log-execution.decorator';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';

/**
 * Logica de negocio asociada a los usuarios.
 */
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /** Devuelve todos los usuarios. */
  @LogExecution()
  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  /**
   * Busca un usuario por su identificador.
   * @throws EntityNotFoundException si el usuario no existe.
   */
  findById(id: string): User {
    const user = this.usersRepository.findById(id);
    if (!user) {
      throw new EntityNotFoundException('User', id);
    }
    return user;
  }
}
