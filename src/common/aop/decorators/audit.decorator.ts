import { appLogger } from '../../logger/winston.config';
import { AuditAction } from '../enums/audit-action.enum';

/**
 * Aspecto que deja una traza de auditoria de las operaciones que modifican
 * datos del dominio.
 *
 * @param action Accion realizada (crear, actualizar o eliminar).
 * @param entity Nombre de la entidad afectada.
 */
export function Audit(action: AuditAction, entity: string): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const original = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const result = await original.apply(this, args);
      appLogger.info('AUDIT', {
        action,
        entity,
        method: String(propertyKey),
        timestamp: new Date().toISOString(),
      });
      return result;
    };

    return descriptor;
  };
}
