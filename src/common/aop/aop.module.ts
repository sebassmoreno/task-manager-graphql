import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphqlLoggingInterceptor } from './interceptors/graphql-logging.interceptor';
import { GraphqlExceptionFilter } from './filters/graphql-exception.filter';

/**
 * Modulo que registra globalmente los mecanismos de AOP nativos de NestJS:
 * el interceptor de logging de GraphQL y el filtro global de excepciones.
 */
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: GraphqlLoggingInterceptor },
    { provide: APP_FILTER, useClass: GraphqlExceptionFilter },
  ],
})
export class AopModule {}
