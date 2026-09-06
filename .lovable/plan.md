# Corregir el encuadre automático de las coronas

## Qué voy a cambiar
- Convertir en transparentes los fondos internos que vienen pegados dentro de las coronas problemáticas, conservando flores, bordes, lazos y texturas decorativas.
- Mantener la foto detrás de la corona y usar el hueco transparente real para el ajuste automático.
- Reforzar la detección para evitar que confunda pequeños espacios entre flores con el área principal de la foto.

## Verificación
- Probar las coronas con centros blanco, crema, rosado y oscuro al cambiar entre ellas.
- Confirmar que la foto permanece visible, centrada y que los ajustes manuales continúan funcionando.
- Revisar la vista del editor en tamaño celular y comprobar que no haya errores.

## Detalles técnicos
- Se crearán versiones corregidas solo de los PNG que contienen un fondo interno opaco; las coronas que ya tienen transparencia no se modificarán.
- La detección usará mayor resolución y descartará huecos decorativos pequeños.
