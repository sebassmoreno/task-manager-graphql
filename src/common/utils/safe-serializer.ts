/**
 * Utilidades de serializacion segura.
 *
 * Convierten cualquier valor a una cadena JSON sin fallar ante referencias
 * circulares, valores `BigInt` o errores. Se usan en el sistema de logging y
 * en los aspectos para registrar argumentos y resultados sin riesgo.
 */

/**
 * Serializa un valor a JSON de forma segura.
 *
 * @param value Valor a serializar.
 * @param space Indentacion opcional (por defecto, sin indentar).
 * @returns Representacion JSON del valor; nunca lanza excepciones.
 */
export function safeStringify(value: unknown, space?: number): string {
  const seen = new WeakSet<object>();
  try {
    return JSON.stringify(
      value,
      (_key, val) => {
        if (typeof val === 'bigint') {
          return val.toString();
        }
        if (val instanceof Error) {
          return { name: val.name, message: val.message };
        }
        if (typeof val === 'object' && val !== null) {
          if (seen.has(val)) {
            return '[Circular]';
          }
          seen.add(val);
        }
        return val;
      },
      space,
    );
  } catch {
    return '[Unserializable]';
  }
}
