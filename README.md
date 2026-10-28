# Task Manager API · GraphQL + NestJS

API GraphQL para gestionar las tareas de proyectos de software: crear, filtrar, mover por estados, etiquetar y eliminar.
Lo interesante está en cómo se separa lo transversal (logs, auditoría, rendimiento, errores) de la lógica de negocio usando **programación orientada a aspectos**.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Winston](https://img.shields.io/badge/logs-Winston-2DD4BF?style=flat-square)

---

## Qué demuestra este proyecto

- **AOP en dos niveles:** decoradores propios que envuelven métodos (`@LogExecution`, `@MeasurePerformance`, `@Audit`) y un interceptor y un filtro globales de NestJS para cada petición GraphQL.
- **Trazabilidad:** cada consulta o mutación recibe un ID de correlación, así se sigue una petición completa en los logs.
- **Logging serio con Winston:** consola con colores, `logs/application.log` en JSON y `logs/error.log` solo con errores.
- **Capas limpias:** resolvers delgados, validación en DTO con `class-validator`, excepciones de dominio y persistencia detrás de un repositorio.
- **GraphQL code-first:** el esquema se genera solo a partir de las clases TypeScript.

## Cómo correrlo

```bash
npm install
cp .env.example .env
npm run start:dev
```

Abre `http://localhost:3000/graphql` para usar el playground.

| Script | Qué hace |
|---|---|
| `npm run start:dev` | Desarrollo con recarga automática |
| `npm run build` | Compila a `dist/` |
| `npm run start:prod` | Ejecuta la versión compilada |
| `npm run lint` | Revisa el código con ESLint |

## Modelo de datos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `ID` | Identificador único (UUID) |
| `title` | `String` | Título de la tarea |
| `description` | `String` | Descripción |
| `status` | `TaskStatus` | `BACKLOG`, `TODO`, `IN_PROGRESS`, `DONE` |
| `tags` | `[String]` | Etiquetas |
| `createdAt` / `updatedAt` | `Date` | Fechas de creación y modificación |
| `assignedUser` | `User` | Responsable |
| `project` | `Project` | Proyecto al que pertenece |

Los datos viven **en memoria** detrás de cada repositorio. Como la persistencia está aislada, pasar a una base de datos real solo implica reemplazar esa clase, sin tocar servicios ni resolvers.

## Programación orientada a aspectos

### Por método: decoradores propios (`src/common/aop/decorators/`)

| Aspecto | Qué hace |
|---|---|
| `@LogExecution()` | Registra entrada, salida, duración y errores del método |
| `@MeasurePerformance(ms)` | Avisa si la operación supera un umbral de tiempo |
| `@Audit(action, entity)` | Deja traza de las operaciones que modifican datos |

```ts
@LogExecution()
@Audit(AuditAction.DELETE, 'Task')
async remove(id: string): Promise<boolean> {
  await this.findById(id);
  return this.tasksRepository.delete(id);
}
```

El método de negocio no tiene ni una línea de log: el comportamiento transversal se añade desde fuera.

### Por petición: mecanismos de NestJS (`AopModule`)

| Aspecto | Qué hace |
|---|---|
| `GraphqlLoggingInterceptor` | Traza cada consulta y mutación con un ID de correlación y su duración |
| `GraphqlExceptionFilter` | Convierte cualquier excepción en un error GraphQL uniforme |

Los logs usan `safeStringify`, que serializa argumentos y resultados sin romperse ante referencias circulares, `BigInt` o errores.

## Estructura

```
src/
├── common/
│   ├── aop/          decoradores, interceptor y filtro
│   ├── logger/       configuración de Winston
│   ├── exceptions/   excepciones de dominio
│   └── utils/        serialización segura
├── tasks/            resolver, servicio, DTO, entidad, repositorio
├── users/
└── projects/
```

## Ejemplos

```graphql
query {
  tasks(filter: { status: IN_PROGRESS, tags: ["aop"] }) {
    id
    title
    status
    assignedUser { fullName }
    project { name }
  }
}
```

```graphql
mutation {
  createTask(input: {
    title: "Documentar la API"
    description: "Escribir el README."
    status: TODO
    tags: ["docs"]
    assignedUserId: "<uuid>"
    projectId: "<uuid>"
  }) { id status }
}
```

```graphql
mutation { changeTaskStatus(input: { id: "<uuid>", status: DONE }) { id status } }
mutation { addTaskTags(id: "<uuid>", tags: ["urgente"]) { id tags } }
mutation { deleteTask(id: "<uuid>") }
```

Los UUID de usuarios y proyectos se obtienen con las consultas `users` y `projects`.

## GitFlow

`main` (estable), `develop` (integración) y `feature/*` (una rama por funcionalidad). Detalle en [`GITFLOW.md`](./GITFLOW.md).

---

**Sebastián Moreno** · Ingeniería Informática, UCAB · [LinkedIn](https://www.linkedin.com/in/sebastian-moreno-dev) · [GitHub](https://github.com/sebassmoreno)
