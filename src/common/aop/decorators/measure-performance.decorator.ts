import { appLogger } from '../../logger/winston.config';

/**
 * Aspecto que mide el tiempo de ejecucion de un metodo y advierte cuando
 * supera un umbral.
 *
 * @param thresholdMs Umbral en milisegundos a partir del cual se emite una
 * advertencia (por defecto, 200 ms).
 */
export function MeasurePerformance(thresholdMs = 200): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const original = descriptor.value;
    const label = `${target.constructor.name}.${String(propertyKey)}`;

    descriptor.value = async function (...args: unknown[]) {
      const start = Date.now();
      const result = await original.apply(this, args);
      const elapsed = Date.now() - start;
      if (elapsed > thresholdMs) {
        appLogger.warn(`${label} supero el umbral`, {
          elapsedMs: elapsed,
          thresholdMs,
        });
      }
      return result;
    };

    return descriptor;
  };
}
