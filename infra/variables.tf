# Qué organización de Neon va a ser dueña del proyecto de preprod. Las cuentas
# nuevas de Neon pertenecen a una organización y la API exige indicarla.
# No es una credencial, pero es propia de cada cuenta: no tiene default y se pasa
# por el entorno (export TF_VAR_neon_org_id=org-...), igual que las claves.
variable "neon_org_id" {
  type        = string
  description = "ID de la organización de Neon (Organization settings, empieza con org-)"
}

# Las imágenes que corre preprod: SIN la etiqueta (va en su propio campo). Son nombres de
# paquetes públicos y una etiqueta: nada de esto es secreto, por eso llevan default.
variable "image_repo_api" {
  type    = string
  default = "ghcr.io/alesiocobresiserravalle/ingsoft3-tp01-backend"
}

variable "image_repo_front" {
  type    = string
  default = "ghcr.io/alesiocobresiserravalle/ingsoft3-tp01-frontend"
}

# Preprod corre la imagen de UN merge concreto, escrita en el código. Cambiarla es un
# PR... y una recreación que se pide a mano: Render no deja actualizar un servicio free.
variable "image_tag" {
  type    = string
  default = "sha-a95fc1eee893b1cef710ed7556fede44c6aaabef"
}

variable "region" {
  type    = string
  default = "ohio" # la misma región que la base de Neon (us-east-2)
}
