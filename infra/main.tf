terraform {
  required_version = ">= 1.5"

  required_providers {
    neon = {
      source  = "kislerdm/neon"
      version = "0.18.0" # fijada: el repo del provider está archivado y los nombres de atributos cambian entre versiones
    }
    render = {
      source  = "render-oss/render"
      version = "1.9.1"
    }
  }
}

# Ninguna credencial está escrita acá: los providers las leen del entorno.
provider "neon" {}   # NEON_API_KEY
provider "render" {} # RENDER_API_KEY y RENDER_OWNER_ID

# --- El proyecto de Neon de PREPROD: no existe hasta que esto se aplica ---
# Un proyecto PROPIO (y no una base más en el de la app) para poder destruirlo
# entero sin rozar QA ni producción.

resource "neon_project" "preprod" {
  name   = "campusgear-preprod"
  org_id = trimspace(var.neon_org_id) # por si el export trae un salto de línea o espacios

  # Sin esta línea el primer apply falla: el provider pide por defecto un día de
  # historial (86400 s) y el tope del plan gratuito es seis horas (21600 s).
  history_retention_seconds = 21600
}

resource "neon_role" "preprod" {
  project_id = neon_project.preprod.id
  branch_id  = neon_project.preprod.default_branch_id # default_branch_id, NO branch_id
  name       = "app_preprod_owner"
}

resource "neon_database" "preprod" {
  project_id = neon_project.preprod.id
  branch_id  = neon_project.preprod.default_branch_id
  name       = "app_preprod"
  owner_name = neon_role.preprod.name
}

# --- Conexión y esquema de la base ---

locals {
  # La cadena de conexión se ARMA con lo que devolvió Neon. Nadie la copia y pega:
  # copiar la de otro entorno era el error más caro del TP6. Es de Prisma
  # (URI postgresql://), no el formato de pares de Npgsql de la guía.
  database_url = "postgresql://${neon_role.preprod.name}:${urlencode(neon_role.preprod.password)}@${neon_project.preprod.database_host}/${neon_database.preprod.name}?sslmode=require"
}

# Una base nueva nace VACÍA y nuestro backend no crea el esquema al arrancar (usa
# migraciones de Prisma, y la imagen no trae el CLI). Terraform crea la base, no el
# esquema: esa es la frontera. Para que UN `apply` deje el entorno funcionando, la
# migración corre acá, apenas existe la base. Es un provisioner (último recurso en
# Terraform) y depende del CLI de Prisma en la máquina que aplica: se documenta.
resource "terraform_data" "migrar_esquema" {
  triggers_replace = neon_database.preprod.id # si la base se recrea, se vuelve a migrar

  provisioner "local-exec" {
    working_dir = "${path.module}/../backend"
    command     = "npx prisma migrate deploy"
    environment = {
      DATABASE_URL = local.database_url
    }
  }
}

# --- Los dos servicios de PREPROD, corriendo la imagen del pipeline ---

resource "render_web_service" "api" {
  name   = "campusgear-api-preprod"
  plan   = "free"
  region = var.region

  health_check_path = "/health"

  runtime_source = {
    image = {
      image_url = var.image_repo_api # SIN la etiqueta pegada
      tag       = var.image_tag
    }
  }

  env_vars = {
    DATABASE_URL = { value = local.database_url }
  }

  depends_on = [terraform_data.migrar_esquema] # que el esquema exista antes de recibir tráfico
}

resource "render_web_service" "front" {
  name   = "campusgear-front-preprod"
  plan   = "free"
  region = var.region

  runtime_source = {
    image = {
      image_url = var.image_repo_front
      tag       = var.image_tag
    }
  }

  env_vars = {
    # La URL sale del atributo de la api de ESTE entorno: no se copia de ningún lado.
    BACKEND_URL  = { value = trimsuffix(render_web_service.api.url, "/") }
    DNS_RESOLVER = { value = "8.8.8.8" }
    PORT         = { value = "80" } # nuestro nginx escucha en el 80; Render espera 10000 por defecto
  }
}
