#!/usr/bin/env bash
# USO:
#   1. Crea un repositorio PUBLICO y VACIO en GitHub (sin README, sin .gitignore).
#   2. Ejecuta:  bash setup-git.sh https://github.com/TU_USUARIO/TU_REPO.git
set -e

REMOTE_URL="$1"

if [ -z "$REMOTE_URL" ]; then
  echo "ERROR: falta la URL del repositorio."
  echo "Uso: bash setup-git.sh https://github.com/TU_USUARIO/TU_REPO.git"
  exit 1
fi

if [ ! -f .gitignore ]; then
  echo "ERROR: no se encontro el archivo .gitignore. Aborto por seguridad."
  exit 1
fi

if ! git config user.name > /dev/null && ! git config --global user.name > /dev/null; then
  echo "ERROR: Git no tiene configurada tu identidad. Ejecuta primero:"
  echo "  git config --global user.name \"Sebastian Moreno\""
  echo "  git config --global user.email \"tu-correo@ejemplo.com\""
  exit 1
fi

echo ">>> Inicializando repositorio..."
git init -b main
git remote add origin "$REMOTE_URL"

git add .gitignore
git commit -m "chore: inicializa el repositorio con .gitignore"

git checkout -b develop

echo ">>> feature/project-setup"
git checkout -b feature/project-setup
git add package.json package-lock.json tsconfig.json nest-cli.json .prettierrc .env.example
git commit -m "chore: configuracion inicial del proyecto NestJS con TypeScript"
git checkout develop
git merge --no-ff feature/project-setup -m "Merge branch 'feature/project-setup' into develop"

echo ">>> feature/logging-system"
git checkout -b feature/logging-system
git add src/common/logger src/common/utils
git commit -m "feat: sistema de logging con Winston y serializacion segura"
git checkout develop
git merge --no-ff feature/logging-system -m "Merge branch 'feature/logging-system' into develop"

echo ">>> feature/aop-decorators"
git checkout -b feature/aop-decorators
git add src/common/aop/decorators
git commit -m "feat: aspectos LogExecution, MeasurePerformance y Audit"
git checkout develop
git merge --no-ff feature/aop-decorators -m "Merge branch 'feature/aop-decorators' into develop"

echo ">>> feature/aop-interceptors"
git checkout -b feature/aop-interceptors
git add src/common/aop src/common/exceptions
git commit -m "feat: interceptor de GraphQL y filtro global de excepciones"
git checkout develop
git merge --no-ff feature/aop-interceptors -m "Merge branch 'feature/aop-interceptors' into develop"

echo ">>> feature/domain-users-projects"
git checkout -b feature/domain-users-projects
git add src/users src/projects
git commit -m "feat: dominio de usuarios y proyectos con sus resolvers"
git checkout develop
git merge --no-ff feature/domain-users-projects -m "Merge branch 'feature/domain-users-projects' into develop"

echo ">>> feature/domain-tasks"
git checkout -b feature/domain-tasks
git add src/tasks/entities src/tasks/enums src/tasks/dto src/tasks/repositories src/tasks/tasks.service.ts
git commit -m "feat: entidad Task, DTOs validados y reglas de negocio del tablero"
git checkout develop
git merge --no-ff feature/domain-tasks -m "Merge branch 'feature/domain-tasks' into develop"

echo ">>> feature/graphql-api"
git checkout -b feature/graphql-api
git add src/tasks src/app.module.ts src/main.ts
git commit -m "feat: API GraphQL de tareas con consultas y mutaciones"
git checkout develop
git merge --no-ff feature/graphql-api -m "Merge branch 'feature/graphql-api' into develop"

echo ">>> feature/documentation"
git checkout -b feature/documentation
git add README.md GITFLOW.md setup-git.sh
git add -A
git commit -m "docs: README, guia de GitFlow y documentacion del proyecto"
git checkout develop
git merge --no-ff feature/documentation -m "Merge branch 'feature/documentation' into develop"

echo ">>> Integrando develop en main"
git checkout main
git merge --no-ff develop -m "Merge branch 'develop' into main"

echo ">>> Verificando que no se suban archivos prohibidos..."
if git ls-files | grep -E "node_modules|^\.env$" > /dev/null; then
  echo "ERROR: se detectaron node_modules o .env en el indice. Revisa el .gitignore."
  exit 1
fi
echo "    OK: node_modules y .env estan correctamente excluidos."

echo ">>> Subiendo a GitHub..."
git push -u origin main
git push -u origin develop
git push origin --all

echo ""
echo "Listo. Historial creado:"
git log --oneline --graph --all | head -30
