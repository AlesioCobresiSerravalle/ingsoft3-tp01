# La cadena de conexión NO sale por output: un output se imprime en la consola y en
# el log de la corrida, y la password del rol es un atributo sensible. Salen sólo
# el host y el nombre de la base, que no son secretos.

output "db_host" {
  value = neon_project.preprod.database_host
}

output "database" {
  value = neon_database.preprod.name
}

output "api_url" {
  value = render_web_service.api.url
}

output "front_url" {
  value = render_web_service.front.url
}
