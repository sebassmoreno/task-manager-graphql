import { appLogger } from '../../logger/winston.config';
import { safeStringify } from '../../utils/safe-serializer';

/**
 * Aspecto que registra la ejecucion de un metodo.
 *
 * Envuelve el metodo original para dejar constancia de su entrada
 * (argumentos), su salida (resultado o error) y la duracion en milisegundos,
 * sin modificar la logica de negocio.
 */
export function LogExecution(): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const original = descriptor.value;
    const label = `${target.constructor.name}.${String(propertyKey)}`;

    descriptor.value = async function (...args: unknown[]) {
      const start = Date.now();
      appLogger.info(`-> ${label}`, { args: safeStringify(args) });
      try {
        const result = await original.apply(this, args);
        appLogger.info(`<- ${label}`, {
          durationMs: Date.now() - start,
          result: safeStringify(result),
        });
        return result;
      } catch (error) {
        appLogger.error(`x ${label}`, {
          durationMs: Date.now() - start,
          error: (error as Error).message,
        });
        throw error;
      }
    };

    return descriptor;
  };
}
