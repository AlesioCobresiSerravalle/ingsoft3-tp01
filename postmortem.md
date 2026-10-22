# Postmortem: un despliegue a producción declarado exitoso sin que nada verificara qué versión ni qué configuración corrían — 22/10/2026

## Resumen
El despliegue a producción de Sentry (commit `c3c9831`) terminó en verde, pero durante unos **10 minutos**
(16:41–16:51, hora local) producción corría con **Sentry apagado en el backend** y, según una verificación a las
~16:45, con el **frontend todavía sirviendo el bundle anterior**. Ningún usuario se vio afectado (producción siguió
respondiendo). Lo detectó una persona mirando a mano; ninguna alarma ni ningún paso del pipeline lo señaló.

## Impacto
- Ninguna caída: `/health`, la API y el frontend respondieron todo el tiempo.
- Pérdida de observabilidad durante ~10 minutos: el backend no enviaba errores ni tiempos a Sentry.
- Un reintento manual del job de despliegue a producción para converger.

## Timeline (hora local, UTC−3; los eventos de Render salen de *Events* de cada servicio)
| Hora | Qué pasó |
|---|---|
| 21/10 13:59 | Se mergea el PR de Sentry. 14:04: QA, integración y e2e en verde. El despliegue a PROD queda esperando la aprobación |
| 22/10 16:40 | Se aprueba. Los hooks despliegan `sha-c3c9831…` en el backend y en el frontend de PROD |
| 22/10 16:41 | Render marca **live** ambos servicios. El job `deploy-prod` termina en `success` |
| ~16:42 | Se prueba el endpoint de práctica (responde 500, como corresponde) y **Sentry no muestra ningún dato** |
| ~16:45 | Una verificación desde afuera encuentra que el frontend de PROD sirve el bundle anterior (243 kB, sin Sentry) mientras QA ya sirve el nuevo; el backend sí tiene el código nuevo |
| 16:45–16:51 | Se revisa *Environment* del backend de PROD: **solo estaba `DATABASE_URL`**; no estaban `SENTRY_DSN` ni `SENTRY_ENVIRONMENT`. Se cargan |
| 16:51 | Se vuelve a correr el job `deploy-prod`: Render redespliega la misma imagen en los dos servicios (live 16:51) |
| ~16:52 | El frontend de PROD sirve el bundle nuevo |
| 16:53–16:54 | Se genera un error de prueba y aparece en Sentry |

## Causa raíz (del sistema, no de una persona)
Tres cosas que el sistema permitió, de las cuales dos están confirmadas y una no:

1. **La configuración que la versión necesitaba vivía en un paso manual que ningún control exigía ni comprobaba.**
   `SENTRY_DSN` es una variable de entorno que se carga a mano en el panel de Render. Nada en el proceso la exigía
   antes de aprobar, y el diseño hace que Sentry quede **apagado en silencio** si falta (es lo correcto para que
   la app no dependa de él, pero vuelve invisible el olvido). Resultado: un despliegue «exitoso» con una
   capacidad nueva desactivada. *(Confirmado.)*
2. **El pipeline no puede saber qué versión sirve cada servicio.** El smoke test comprueba que el entorno
   **responde**, no que ejecute la imagen pedida. Cuando lo desplegado y lo servido difieren, solo una persona
   comparando a mano lo ve. Este hueco ya estaba documentado como límite conocido en el TP7. *(Confirmado.)*
3. **Por qué el frontend servía el bundle anterior a las 16:45 pese a figurar «live» desde las 16:41: no se
   pudo determinar.** *Events* de Render muestra un único despliegue por el hook con la imagen correcta, sin
   despliegues manuales ni imagen vieja (una primera hipótesis —un *Manual Deploy* de la imagen de *Settings*—
   fue **descartada** con esa evidencia). Hipótesis sin comprobar: la transición entre la instancia anterior y la
   nueva. Lo que sí está claro es que el sistema no lo informó. *(Pendiente.)*

## Acciones
| # | Acción (cambio al sistema, no una promesa) | Cómo | Dueño |
|---|---|---|---|
| 1 | **Que el servicio diga qué commit corre y el pipeline lo compare** | pasar `APP_COMMIT` como argumento de build a las dos imágenes; el `/health` del backend y un `version.txt` del frontend lo devuelven; el smoke de PROD espera (con reintentos) a que coincida con el commit de la corrida. Convierte las causas 2 y 3 en una señal del pipeline | yo, próximo ciclo (implementable con lo que ya hay: TP7 §2.4) |
| 2 | **Hacer visible que Sentry está apagado** | loguear al arrancar `Sentry: activo (environment=…)` o `apagado (falta SENTRY_DSN)`, y sumar un campo al `/health` que el smoke de PROD compruebe | yo |
| 3 | **Checklist de variables en cada PR que las necesite** (complemento humano, más débil) | casilla en la plantilla del PR: «variables nuevas cargadas en Render antes de aprobar» | yo |
| 4 | **Sacar la configuración de producción de la memoria de alguien** | a futuro, declarar las variables de PROD como código, como se hizo con preprod en el TP8 | a evaluar |

## Aprendizajes
- **«Success» en el pipeline no es «corre lo que pedí».** Lo que no se mide no se sabe; y lo que se sabe solo
  mirando a mano no escala.
- **Una función apagada en silencio es la más difícil de notar.** Que una dependencia opcional falle sin
  ruido es una buena decisión de diseño y necesita su propia señal de estado.
- **Cuando una hipótesis se refuta, se dice.** La primera explicación (despliegue manual de la imagen vieja)
  parecía encajar y era falsa; los eventos de Render la descartaron.
- **Relacionado:** durante este mismo práctico, una aprobación de PROD olvidada retuvo el grupo de concurrencia
  y dejó en cola a la corrida siguiente. La salida fue rechazar la vieja y aprobar la nueva. Las aprobaciones
  pendientes también son estado que conviene hacer visible.
