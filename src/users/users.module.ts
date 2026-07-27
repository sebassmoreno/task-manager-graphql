import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UsersRepository } from './repositories/users.repository';

/**
 * Modulo del dominio de usuarios.
 */
@Module({
  providers: [UsersService, UsersResolver, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
