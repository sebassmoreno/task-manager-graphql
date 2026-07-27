import { Global, Module } from '@nestjs/common';
import { appLogger, WINSTON_LOGGER } from './winston.config';

/**
 * Modulo global que expone el logger de Winston al resto de la aplicacion.
 *
 * Al ser `@Global()`, cualquier proveedor puede inyectar `WINSTON_LOGGER`
 * sin necesidad de volver a importar este modulo.
 */
@Global()
@Module({
  providers: [{ provide: WINSTON_LOGGER, useValue: appLogger }],
  exports: [WINSTON_LOGGER],
})
export class LoggerModule {}
