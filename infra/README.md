# infra/ — el entorno `preprod`, declarado

Terraform crea un entorno **nuevo** (`preprod`): su base en Neon y sus dos servicios en Render,
corriendo la imagen del pipeline. **No toca QA ni producción.**

## Requisitos
- Terraform ≥ 1.5 (`terraform -version`) y Node 22 con `backend/node_modules` instalado
  (`cd backend && npm ci`): la migración del esquema usa el CLI de Prisma.
- Tres claves, **solo en el entorno de tu terminal** (nunca en un archivo del repo):

```bash
export NEON_API_KEY="..."
export RENDER_API_KEY="..."
export RENDER_OWNER_ID="..."      # tea-... o usr-...
export TF_VAR_neon_org_id="org-..."   # no es una clave, pero es propia de cada cuenta
```

## Ciclo
```bash
cd infra
terraform init        # baja los providers fijados por .terraform.lock.hcl
terraform plan        # qué va a pasar, sin hacerlo
terraform apply       # crea la base, migra el esquema y levanta api + front
terraform output      # las URLs (leerlas de acá: no darlas por iguales)
terraform destroy     # baja TODO preprod
```

El **estado** (`terraform.tfstate`) vive en esta máquina y tiene contraseñas en texto plano:
está en el `.gitignore` y no se commitea nunca. Si se pierde, Terraform deja de saber que preprod
es suyo (hay que importarlo).

Render no permite modificar un servicio `free`: para cambiar la etiqueta de la imagen se recrea
(`terraform apply -replace=render_web_service.api`, o `destroy` + `apply`).

Las 750 horas gratuitas de Render son del workspace: **`terraform destroy` al terminar de usarlo**.
