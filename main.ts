import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appLogger } from './common/logger/winston.config';

/**
 * Punto de entrada de la aplicacion.
 *
 * Arranca el servidor NestJS, activa la validacion global de los DTOs y
 * expone el endpoint de GraphQL.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  appLogger.info(`Servidor GraphQL en http://localhost:${port}/graphql`);
}

void bootstrap();
