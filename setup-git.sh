#!/usr/bin/env bash
# ============================================================================
#  Publica el proyecto en GitHub con historial GitFlow y VERIFICA que todo el
#  codigo (carpeta src/) quede realmente versionado.
#
#  USO:
#    1. Crea un repositorio PUBLICO y VACIO en GitHub (sin README, sin .gitignore).
#    2. Ejecuta ESTE script DENTRO de la carpeta del proyecto (la que contiene src/):
#         bash setup-git.sh https://github.com/TU_USUARIO/TU_REPO.git
# ============================================================================
set -e

REMOTE_URL="$1"

if [ -z "$REMOTE_URL" ]; then
  echo "ERROR: falta la URL del repositorio."
  echo "Uso: bash setup-git.sh https://github.com/TU_USUARIO/TU_REPO.git"
  exit 1
fi

# ---------------------------------------------------------------------------
# 1) VERIFICACION PREVIA: que el proyecto este completo antes de tocar Git.
# ---------------------------------------------------------------------------
echo ">>> Verificando que el proyecto este completo..."
MISSING=""
for path in \
  .gitignore package.json package-lock.json tsconfig.json nest-cli.json .prettierrc .env.example \
  README.md GITFLOW.md \
  src src/main.ts src/app.module.ts \
  src/common/logger src/common/utils src/common/aop/decorators src/common/aop src/common/exceptions \
  src/users src/projects \
  src/tasks src/tasks/entities src/tasks/enums src/tasks/dto src/tasks/repositories src/tasks/tasks.service.ts
do
  [ -e "$path" ] || MISSING="$MISSING\n  - $path"
done

TS_COUNT=$(find src -name '*.ts' 2>/dev/null | wc -l | tr -d ' ')

if [ -n "$MISSING" ] || [ "${TS_COUNT:-0}" -lt 30 ]; then
  echo ""
  echo "ERROR: el proyecto esta INCOMPLETO. No se subio nada."
  echo "Asegurate de ejecutar el script DENTRO de la carpeta que contiene 'src/'."
  [ -n "$MISSING" ] && echo -e "Faltan estos elementos:$MISSING"
  echo "Archivos .ts encontrados en src/: ${TS_COUNT:-0} (se esperaban al menos 30)."
  exit 1
fi
echo "    OK: estructura completa ($TS_COUNT archivos .ts en src/)."

# ---------------------------------------------------------------------------
# 2) Identidad de Git. Si no esta configurada, se pregunta una sola vez.
# ---------------------------------------------------------------------------
if ! git config user.name >/dev/null 2>&1 && ! git config --global user.name >/dev/null 2>&1; then
  echo ">>> Git no tiene configurada tu identidad."
  read -r -p "    Tu nombre para los commits: " GIT_NAME || true
  read -r -p "    Tu correo para los commits: " GIT_EMAIL || true
fi

# ---------------------------------------------------------------------------
# 3) Inicializacion + historial GitFlow.
# ---------------------------------------------------------------------------
echo ">>> Inicializando repositorio..."
git init -b main
git remote add origin "$REMOTE_URL"

[ -n "${GIT_NAME:-}" ]  && git config user.name  "$GIT_NAME"
[ -n "${GIT_EMAIL:-}" ] && git config user.email "$GIT_EMAIL"

if ! git config user.name >/dev/null 2>&1 || ! git config user.email >/dev/null 2>&1; then
  echo "ERROR: falta la identidad de Git. Configurala y vuelve a ejecutar:"
  echo "  git config --global user.name \"Tu Nombre\""
  echo "  git config --global user.email \"tu-correo@ejemplo.com\""
  exit 1
fi

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

# ---------------------------------------------------------------------------
# 4) VERIFICACION POSTERIOR: que src/ y todo lo demas quedaron versionados.
# ---------------------------------------------------------------------------
echo ">>> Verificando que el codigo quedo versionado..."
SRC_TRACKED=$(git ls-files | grep -c "^src/" || true)
if [ "${SRC_TRACKED:-0}" -lt 30 ]; then
  echo "ERROR: solo se versionaron ${SRC_TRACKED:-0} archivos de src/. No subo una entrega incompleta."
  exit 1
fi
if git ls-files | grep -E "node_modules|^\.env$" > /dev/null; then
  echo "ERROR: se detectaron node_modules o .env en el indice. Revisa el .gitignore."
  exit 1
fi
echo "    OK: $SRC_TRACKED archivos de src/ versionados; node_modules y .env excluidos."

# ---------------------------------------------------------------------------
# 5) Subida a GitHub + resumen.
# ---------------------------------------------------------------------------
echo ">>> Subiendo a GitHub..."
git push -u origin main
git push -u origin develop
git push origin --all

TOTAL=$(git ls-files | wc -l | tr -d ' ')
BRANCHES=$(git branch | wc -l | tr -d ' ')
echo ""
echo "======================================================"
echo " LISTO. Entrega publicada correctamente."
echo "   - Archivos de src/ versionados : $SRC_TRACKED"
echo "   - Total de archivos versionados: $TOTAL"
echo "   - Ramas creadas                : $BRANCHES"
echo "   - Repositorio                  : $REMOTE_URL"
echo "======================================================"
git log --oneline --graph --all | head -30
