import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AopModule } from './common/aop/aop.module';
import { LoggerModule } from './common/logger/logger.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

/**
 * Modulo raiz de la aplicacion.
 *
 * Configura GraphQL en modo code-first y agrupa los modulos comunes
 * (logging y AOP) y los de dominio (tareas, usuarios y proyectos).
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
    LoggerModule,
    AopModule,
    TasksModule,
    UsersModule,
    ProjectsModule,
  ],
})
export class AppModule {}
