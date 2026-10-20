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
  org_id = var.neon_org_id

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
