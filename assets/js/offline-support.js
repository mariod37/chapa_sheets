// Soporte Offline - Funciones compartidas para todos los archivos
// Este archivo proporciona funcionalidad de almacenamiento local y manejo offline

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  // Calcular la ruta base para que funcione tanto en local como en GitHub Pages
  const swPath = (location.pathname.endsWith('/') 
    ? location.pathname 
    : location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1)) + 'service-worker.js';
  navigator.serviceWorker.register(swPath)
    .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
    .catch(err => console.warn('⚠️ Error al registrar Service Worker:', err));
}

// Crear indicador de estado en el navbar
function createOnlineIndicator() {
  const navbar = document.querySelector('.navbar');
  if (navbar && !document.getElementById('online-status-badge')) {
    const indicator = document.createElement('span');
    indicator.id = 'online-status-badge';
    indicator.className = 'badge bg-success ms-2';
    indicator.textContent = '● En línea';
    indicator.style.fontSize = '0.75rem';
    
    const container = navbar.querySelector('.container-fluid');
    if (container) {
      container.appendChild(indicator);
    }
  }
}

// Actualizar indicador de estado online/offline
function updateOnlineStatus() {
  const indicator = document.getElementById('online-status-badge') || document.getElementById('status-indicator');
  
  if (indicator) {
    if (navigator.onLine) {
      indicator.textContent = '● En línea';
      indicator.className = indicator.id === 'online-status-badge' ? 
        'badge bg-success ms-2' : 'badge bg-success';
    } else {
      indicator.textContent = '● Sin conexión';
      indicator.className = indicator.id === 'online-status-badge' ? 
        'badge bg-warning text-dark ms-2' : 'badge bg-warning text-dark';
    }
  }
}

// Event listeners para cambios de conectividad
window.addEventListener('online', () => {
  updateOnlineStatus();
  console.log('✅ Conexión restaurada');
  // Intentar recargar datos automáticamente si hay una función loadData
  if (typeof loadData === 'function') {
    setTimeout(loadData, 500);
  }
});

window.addEventListener('offline', () => {
  updateOnlineStatus();
  console.log('⚠️ Sin conexión - usando datos en caché');
});

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
  createOnlineIndicator();
  updateOnlineStatus();
});

// Función para guardar datos en localStorage
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(key + '_timestamp', Date.now().toString());
    console.log(`✅  Datos guardados en localStorage (clave: ${key})`);
    return true;
  } catch (e) {
    console.error('❌ Error al guardar en localStorage:', e);
    return false;
  }
}

// Función para cargar datos desde localStorage
function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    const timestamp = localStorage.getItem(key + '_timestamp');
    
    if (data) {
      const parsedData = JSON.parse(data);
      const date = timestamp ? new Date(parseInt(timestamp)) : null;
      console.log(`📦 Datos cargados desde localStorage (guardados: ${date ? date.toLocaleString() : 'desconocido'})`);
      return parsedData;
    }
  } catch (e) {
    console.error('❌ Error al cargar desde localStorage:', e);
  }
  return null;
}

// Función para obtener la fecha de última actualización
function getLastUpdateDate(key) {
  const timestamp = localStorage.getItem(key + '_timestamp');
  if (timestamp) {
    return new Date(parseInt(timestamp));
  }
  return null;
}

// Función para mostrar aviso de modo offline
function showOfflineWarning(containerSelector = 'body') {
  const container = document.querySelector(containerSelector);
  if (container && !document.getElementById('offline-warning-banner')) {
    const warning = document.createElement('div');
    warning.id = 'offline-warning-banner';
    warning.className = 'alert alert-warning alert-dismissible fade show m-3';
    warning.innerHTML = `
      <strong>📡 Modo sin conexión</strong> - Mostrando última versión guardada.
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    container.insertBefore(warning, container.firstChild);
  }
}

// Función para ocultar aviso de modo offline
function hideOfflineWarning() {
  const warning = document.getElementById('offline-warning-banner');
  if (warning) {
    warning.remove();
  }
}

// Función helper para fetch con soporte offline
async function fetchWithOfflineSupport(url, storageKey) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    const json = JSON.parse(text.substring(47).slice(0, -2)); // Para Google Sheets API
    
    // Guardar en localStorage
    saveToStorage(storageKey, json);
    hideOfflineWarning();
    
    return { data: json, fromCache: false };
  } catch (error) {
    console.warn('⚠️ Error al cargar datos online, intentando caché:', error.message);
    
    // Intentar cargar desde localStorage
    const cachedData = loadFromStorage(storageKey);
    
    if (cachedData) {
      showOfflineWarning('.container');
      return { data: cachedData, fromCache: true };
    } else {
      throw new Error('No hay conexión y no hay datos en caché disponibles');
    }
  }
}

console.log('📱 Soporte offline cargado');
