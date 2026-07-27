import { DomainException } from './domain.exception';

/**
 * Se lanza cuando no existe una entidad con el identificador solicitado.
 */
export class EntityNotFoundException extends DomainException {
  /**
   * @param entity Nombre de la entidad buscada.
   * @param id Identificador que no fue encontrado.
   */
  constructor(entity: string, id: string) {
    super(`${entity} con id "${id}" no encontrada`, 'ENTITY_NOT_FOUND');
  }
}
