import { createLogger, format, transports, Logger } from 'winston';

/**
 * Token de inyeccion para el logger de Winston compartido.
 */
export const WINSTON_LOGGER = 'WINSTON_LOGGER';

const { combine, timestamp, colorize, printf, json } = format;

/**
 * Formato legible para la salida por consola, con colores por nivel.
 */
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${ts} [${level}] ${message}${extra}`;
  }),
);

/**
 * Instancia unica del logger de la aplicacion.
 *
 * Escribe en tres destinos:
 * - Consola, con colores por nivel.
 * - `logs/application.log`, historial completo en formato JSON.
 * - `logs/error.log`, unicamente los errores.
 *
 * El nivel se controla con la variable de entorno `LOG_LEVEL`.
 */
export const appLogger: Logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.File({
      filename: 'logs/application.log',
      format: combine(timestamp(), json()),
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), json()),
    }),
  ],
});
