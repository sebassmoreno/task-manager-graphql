# GitFlow

Este proyecto sigue el modelo de ramas **GitFlow**.

## Ramas permanentes

- `main`: contiene unicamente versiones estables e integradas.
- `develop`: rama de integracion donde confluyen las funcionalidades.

## Ramas temporales

- `feature/*`: una rama por funcionalidad. Se crean a partir de `develop` y se
  reintegran en `develop` mediante *merge* con `--no-ff`, de modo que el
  historial conserve el punto de integracion de cada funcionalidad.

## Flujo seguido

Las funcionalidades se integraron en este orden:

1. `feature/project-setup` — configuracion inicial de NestJS y TypeScript.
2. `feature/logging-system` — sistema de logging con Winston y serializacion segura.
3. `feature/aop-decorators` — aspectos `LogExecution`, `MeasurePerformance` y `Audit`.
4. `feature/aop-interceptors` — interceptor de GraphQL y filtro global de excepciones.
5. `feature/domain-users-projects` — dominios de usuarios y proyectos.
6. `feature/domain-tasks` — entidad `Task`, DTOs validados y reglas de negocio.
7. `feature/graphql-api` — API GraphQL de tareas con consultas y mutaciones.
8. `feature/documentation` — README, esta guia y demas documentacion.

Cada rama se integro en `develop` con `--no-ff` y, finalmente, `develop` se
integro en `main`.

## Reproducir el historial

El script `setup-git.sh` automatiza la creacion de este historial sobre un
repositorio publico y vacio:

```bash
bash setup-git.sh https://github.com/TU_USUARIO/TU_REPO.git
```
