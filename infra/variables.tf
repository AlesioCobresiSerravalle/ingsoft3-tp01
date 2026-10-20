# Qué organización de Neon va a ser dueña del proyecto de preprod. Las cuentas
# nuevas de Neon pertenecen a una organización y la API exige indicarla.
# No es una credencial, pero es propia de cada cuenta: no tiene default y se pasa
# por el entorno (export TF_VAR_neon_org_id=org-...), igual que las claves.
variable "neon_org_id" {
  type        = string
  description = "ID de la organización de Neon (Organization settings, empieza con org-)"
}
