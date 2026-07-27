import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ChangeTaskStatusInput } from './dto/change-task-status.input';
import { CreateTaskInput } from './dto/create-task.input';
import { TaskFilterInput } from './dto/task-filter.input';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

/**
 * Resolver GraphQL del dominio de tareas.
 */
@Resolver(() => Task)
export class TasksResolver {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  /** Lista las tareas, con filtro opcional. */
  @Query(() => [Task], { name: 'tasks' })
  tasks(
    @Args('filter', { nullable: true }) filter?: TaskFilterInput,
  ): Promise<Task[]> {
    return this.tasksService.findAll(filter);
  }

  /** Crea una nueva tarea. */
  @Mutation(() => Task)
  createTask(@Args('input') input: CreateTaskInput): Promise<Task> {
    return this.tasksService.create(input);
  }

  /** Cambia el estado de una tarea. */
  @Mutation(() => Task)
  changeTaskStatus(@Args('input') input: ChangeTaskStatusInput): Promise<Task> {
    return this.tasksService.changeStatus(input);
  }

  /** Anade etiquetas a una tarea. */
  @Mutation(() => Task)
  addTaskTags(
    @Args('id', { type: () => ID }) id: string,
    @Args('tags', { type: () => [String] }) tags: string[],
  ): Promise<Task> {
    return this.tasksService.addTags(id, tags);
  }

  /** Elimina una tarea. */
  @Mutation(() => Boolean)
  deleteTask(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.tasksService.remove(id);
  }

  /** Resuelve el usuario asignado de una tarea. */
  @ResolveField(() => User, { name: 'assignedUser' })
  assignedUser(@Parent() task: Task): User {
    return this.usersService.findById(task.assignedUserId);
  }

  /** Resuelve el proyecto de una tarea. */
  @ResolveField(() => Project, { name: 'project' })
  project(@Parent() task: Task): Project {
    return this.projectsService.findById(task.projectId);
  }
}
