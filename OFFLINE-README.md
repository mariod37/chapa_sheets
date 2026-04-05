# Sistema de Soporte Offline

Este proyecto ahora incluye soporte completo para trabajar sin conexión a internet.

## Características

✅ **Almacenamiento automático en caché** - Los datos de Google Sheets se guardan localmente
✅ **Modo offline** - Visualiza los últimos datos guardados sin conexión
✅ **Indicador de estado** - Badge que muestra si estás en línea o sin conexión
✅ **Actualización automática** - Cuando recuperas la conexión, los datos se actualizan
✅ **Service Worker** - Cachea archivos estáticos para acceso rápido

## Cómo funciona

1. **Primera carga (con internet)**:
   - Los datos se descargan desde Google Sheets
   - Se guardan automáticamente en localStorage del navegador
   - Se muestran normalmente

2. **Sin conexión**:
   - Los datos se cargan desde localStorage
   - Aparece un aviso: "📡 Modo sin conexión - Mostrando última versión guardada"
   - El indicador cambia a "● Sin conexión" (amarillo)

3. **Recuperación de conexión**:
   - Los datos se actualizan automáticamente desde Google Sheets
   - El aviso desaparece
   - El indicador vuelve a "● En línea" (verde)

## Archivos del sistema offline

- **service-worker.js** - Service Worker que cachea archivos estáticos
- **assets/js/offline-support.js** - Funciones compartidas de soporte offline
- Cada página HTML incluye el soporte offline automáticamente

## Almacenamiento

Los datos se guardan en localStorage del navegador con las siguientes claves:
- `vida-ministerio-data` - Datos de Vida y Ministerio
- `[pagina]-data` - Datos de cada página (predicacion, limpieza, etc.)
- `[clave]_timestamp` - Fecha de última actualización

## Limpiar caché

Si necesitas limpiar los datos guardados:

1. Abre las DevTools del navegador (F12)
2. Ve a Application > Local Storage
3. Elimina las claves que desees borrar
4. Recarga la página (F5)

## Compatibilidad

- ✅ Chrome/Edge (todas las versiones recientes)
- ✅ Firefox (todas las versiones recientes)
- ✅ Safari (versión 11.1+)
- ✅ Dispositivos móviles (iOS Safari, Chrome Android)

## Notas

- El Service Worker solo funciona en HTTPS o localhost
- Los datos se guardan en el navegador, no ocupan espacio en el servidor
- Cada navegador/dispositivo mantiene su propia copia de los datos
- La actualización de datos requiere conexión a internet

## Para desarrolladores

Para integrar soporte offline en una nueva página:

```javascript
// 1. Incluir el script
<script src="assets/js/offline-support.js"></script>

// 2. Usar fetchWithOfflineSupport
const result = await fetchWithOfflineSupport(URL, 'mi-pagina-data');
processData(result.data);

// 3. Crear alias para recarga automática
window.loadData = loadFunction;
```
