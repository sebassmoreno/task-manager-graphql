import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { TasksRepository } from './repositories/tasks.repository';

/**
 * Modulo del dominio de tareas.
 */
@Module({
  imports: [UsersModule, ProjectsModule],
  providers: [TasksService, TasksResolver, TasksRepository],
})
export class TasksModule {}
