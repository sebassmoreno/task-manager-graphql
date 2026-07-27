/**
 * Excepcion base del dominio.
 *
 * Todas las excepciones de negocio heredan de esta clase, que anade un
 * codigo estable para poder mapearlas a errores GraphQL uniformes.
 */
export class DomainException extends Error {
  /**
   * @param message Mensaje descriptivo del error.
   * @param code Codigo estable del error (por defecto, `DOMAIN_ERROR`).
   */
  constructor(
    message: string,
    public readonly code: string = 'DOMAIN_ERROR',
  ) {
    super(message);
    this.name = new.target.name;
  }
}
