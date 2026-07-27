import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { randomUUID } from 'crypto';
import { Observable, tap } from 'rxjs';
import type { Logger } from 'winston';
import { WINSTON_LOGGER } from '../../logger/winston.config';

/**
 * Interceptor que traza cada consulta y mutacion de GraphQL.
 *
 * Asigna un identificador de correlacion unico a cada operacion y registra
 * su inicio, fin y duracion, de modo que las entradas del log puedan
 * seguirse de principio a fin.
 */
@Injectable()
export class GraphqlLoggingInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_LOGGER) private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const correlationId = randomUUID();
    const operation = `${info?.parentType?.name}.${info?.fieldName}`;
    const start = Date.now();

    this.logger.info('GraphQL ->', { correlationId, operation });

    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.info('GraphQL <-', {
            correlationId,
            operation,
            durationMs: Date.now() - start,
          }),
        error: (error: Error) =>
          this.logger.error('GraphQL x', {
            correlationId,
            operation,
            durationMs: Date.now() - start,
            error: error.message,
          }),
      }),
    );
  }
}
