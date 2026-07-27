import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import type { Logger } from 'winston';
import { WINSTON_LOGGER } from '../../logger/winston.config';
import { DomainException } from '../../exceptions/domain.exception';

/**
 * Filtro global que traduce cualquier excepcion a un error de GraphQL con
 * una forma uniforme.
 *
 * Las excepciones de dominio conservan su codigo; el resto se agrupan bajo
 * `INTERNAL_ERROR`. Todos los errores quedan registrados en el log.
 */
@Catch()
export class GraphqlExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_LOGGER) private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): GraphQLError {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const operation = info
      ? `${info.parentType?.name}.${info.fieldName}`
      : 'desconocida';

    if (exception instanceof DomainException) {
      this.logger.warn('Excepcion de dominio', {
        operation,
        code: exception.code,
        message: exception.message,
      });
      return new GraphQLError(exception.message, {
        extensions: { code: exception.code },
      });
    }

    const message =
      exception instanceof Error ? exception.message : 'Error interno';
    this.logger.error('Excepcion no controlada', { operation, message });
    return new GraphQLError(message, {
      extensions: { code: 'INTERNAL_ERROR' },
    });
  }
}
