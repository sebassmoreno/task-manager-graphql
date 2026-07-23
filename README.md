# Task Manager API

API GraphQL para la gestión de tareas de proyectos de desarrollo de software, construida con NestJS.

## Instalación

```bash
npm install
cp .env.example .env
npm run start:dev
```

Servidor disponible en `http://localhost:3000/graphql`

## Scripts

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Modo desarrollo con recarga automática |
| `npm run build` | Compila el proyecto |
| `npm run start:prod` | Ejecuta la versión compilada |
| `npm run lint` | Analiza el código |

## Entidad Task

| Campo | Tipo |
|---|---|
| `id` | `ID` |
| `title` | `String` |
| `description` | `String` |
| `status` | `BACKLOG`, `TODO`, `IN_PROGRESS`, `DONE` |
| `tags` | `[String]` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |
| `assignedUser` | `User` |
| `project` | `Project` |

## Programación Orientada a Aspectos

Los aspectos están en `src/common/aop/`:

**Decoradores** (`decorators/`) — envuelven métodos para añadir comportamiento sin tocar la lógica de negocio:

- `@LogExecution()` — registra entrada, salida, duración y errores
- `@MeasurePerformance(ms)` — advierte si la operación supera un umbral
- `@Audit(action, entity)` — deja traza de las operaciones que modifican datos

**Interceptor y filtro** — mecanismos nativos de NestJS registrados globalmente en `AopModule`:

- `GraphqlLoggingInterceptor` — traza cada consulta y mutación con un ID de correlación
- `GraphqlExceptionFilter` — traduce las excepciones a errores GraphQL uniformes

Ejemplo de uso en `TasksService`:

```ts
@LogExecution()
@Audit(AuditAction.DELETE, 'Task')
async remove(id: string): Promise<boolean> {
  await this.findById(id);
  return this.tasksRepository.delete(id);
}
```

## Logs

Implementados con Winston (`src/common/logger/`). Tres salidas:

- Consola, con colores por nivel
- `logs/application.log` — historial completo en JSON
- `logs/error.log` — solo errores

El nivel se configura con `LOG_LEVEL` en el `.env`.

## Estructura

```
src/
├── common/
│   ├── aop/           Decoradores, interceptor y filtro
│   ├── logger/        Configuración de Winston
│   ├── exceptions/    Excepciones de dominio
│   └── utils/
├── tasks/
├── users/
└── projects/
```

## Consultas de ejemplo

```graphql
query {
  tasks {
    id
    title
    status
    tags
    assignedUser { fullName }
    project { name }
  }
}
```

```graphql
query {
  tasks(filter: { status: IN_PROGRESS, tags: ["aop"] }) {
    id
    title
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
  }) {
    id
    status
  }
}
```

```graphql
mutation {
  changeTaskStatus(input: { id: "<uuid>", status: IN_PROGRESS }) { id status }
}
```

```graphql
mutation {
  addTaskTags(id: "<uuid>", tags: ["urgente"]) { id tags }
}
```

```graphql
mutation {
  deleteTask(id: "<uuid>")
}
```

Los UUID se obtienen con las consultas `users` y `projects`.

## GitFlow

Ramas: `main` (estable), `develop` (integración) y `feature/*` (una por funcionalidad, integrada con `--no-ff`). Detalle en [`GITFLOW.md`](./GITFLOW.md).

---

Sebastián Moreno — Ingeniería Informática
