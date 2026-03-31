/**
 * Helpers centralisés
 * Évite la duplication de code dans les composants
 */

// ─── FORMATAGE ───

/**
 * Formate une taille en bytes en unité lisible
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Formate une date en format lisible
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Date(dateString).toLocaleDateString('fr-FR', {
    ...defaultOptions,
    ...options
  });
};

/**
 * Formate une date relative (ex: "il y a 2 heures")
 */
export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'à l\'instant';
  if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `il y a ${Math.floor(seconds / 86400)}j`;

  return formatDate(dateString, { year: '2-digit', month: 'short', day: 'numeric' });
};

// ─── ICÔNES ───

/**
 * Retourne l'icône appropriée selon le type MIME
 */
export const getFileIcon = (mimeType) => {
  if (!mimeType) return '📄';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('image')) return '🖼️';
  if (mimeType.includes('video')) return '🎥';
  if (mimeType.includes('audio')) return '🎵';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return '📦';
  if (mimeType.includes('text')) return '📋';
  if (mimeType.includes('spreadsheet') || mimeType.includes('sheet')) return '📊';
  if (mimeType.includes('presentation')) return '🎪';
  return '📄';
};

/**
 * Retourne le type de fichier lisible
 */
export const getFileType = (mimeType) => {
  if (!mimeType) return 'Autre';
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
  if (mimeType.includes('image')) return 'Image';
  if (mimeType.includes('video')) return 'Vidéo';
  if (mimeType.includes('audio')) return 'Audio';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return 'Archive';
  if (mimeType.includes('text')) return 'Texte';
  if (mimeType.includes('spreadsheet') || mimeType.includes('sheet')) return 'Feuille';
  if (mimeType.includes('presentation')) return 'Présentation';
  return 'Autre';
};

/**
 * Retourne la couleur pour un type de fichier
 */
export const getTypeColor = (type) => {
  const colors = {
    'PDF': '#FF6B6B',
    'Document': '#4ECDC4',
    'Image': '#45B7D1',
    'Vidéo': '#96CEB4',
    'Audio': '#FFEAA7',
    'Archive': '#DDA0DD',
    'Texte': '#B0E0E6',
    'Feuille': '#FFB6C1',
    'Présentation': '#DEB887',
    'Autre': '#F8BBD9'
  };
  return colors[type] || '#F8BBD9';
};

// ─── VALIDATION ───

/**
 * Valide un nom de fichier/dossier
 */
export const validateName = (name, minLength = 2, maxLength = 255) => {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Le nom ne peut pas être vide' };
  }

  if (name.trim().length < minLength) {
    return { valid: false, error: `Le nom doit contenir au moins ${minLength} caractères` };
  }

  if (name.length > maxLength) {
    return { valid: false, error: `Le nom ne peut pas dépasser ${maxLength} caractères` };
  }

  // Caractères interdits
  const forbiddenChars = /[<>:"|?*]/;
  if (forbiddenChars.test(name)) {
    return { valid: false, error: 'Le nom contient des caractères interdits' };
  }

  return { valid: true };
};

/**
 * Valide une adresse email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide une URL
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ─── RECHERCHE & FILTRAGE ───

/**
 * Recherche dans un tableau d'objets
 */
export const searchInArray = (array, query, fields) => {
  if (!query.trim()) return array;

  const lowerQuery = query.toLowerCase();
  return array.filter(item =>
    fields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(lowerQuery);
    })
  );
};

/**
 * Filtre un tableau par critères multiples
 */
export const filterArray = (array, filters) => {
  return array.filter(item =>
    Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined || value === '') return true;
      return item[key] === value;
    })
  );
};

/**
 * Trie un tableau
 */
export const sortArray = (array, sortBy, order = 'asc') => {
  const sorted = [...array].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (typeof aVal === 'string') {
      return order === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return order === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return sorted;
};

// ─── STATISTIQUES ───

/**
 * Calcule les statistiques d'un tableau de fichiers
 */
export const calculateStats = (documents) => {
  return {
    totalCount: documents.length,
    totalSize: documents.reduce((sum, doc) => sum + (doc.size || 0), 0),
    averageSize: documents.length > 0
      ? documents.reduce((sum, doc) => sum + (doc.size || 0), 0) / documents.length
      : 0,
    typeDistribution: documents.reduce((acc, doc) => {
      const type = getFileType(doc.type);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {})
  };
};

/**
 * Calcule la distribution par catégorie
 */
export const calculateDistribution = (items, categoryField) => {
  return items.reduce((acc, item) => {
    const category = item[categoryField] || 'Autre';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
};

/**
 * Obtient les N premiers éléments
 */
export const getTopItems = (items, field, count = 5) => {
  return [...items]
    .sort((a, b) => (b[field] || 0) - (a[field] || 0))
    .slice(0, count);
};

// ─── UTILITAIRES ───

/**
 * Génère un ID unique
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Clone profond un objet
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Fusionne deux objets
 */
export const mergeObjects = (obj1, obj2) => {
  return { ...obj1, ...obj2 };
};

/**
 * Obtient une valeur imbriquée d'un objet
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
};

/**
 * Définit une valeur imbriquée dans un objet
 */
export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) current[key] = {};
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return obj;
};

/**
 * Débounce une fonction
 */
export const debounce = (func, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle une fonction
 */
export const throttle = (func, limit) => {
  let inThrottle;

  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Retente une fonction avec délai exponentiel
 */
export const retryWithBackoff = async (func, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await func();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Exporte les données en JSON
 */
export const exportToJson = (data, filename = 'export.json') => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Importe des données depuis un fichier JSON
 */
export const importFromJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Fichier JSON invalide'));
      }
    };
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsText(file);
  });
};

/**
 * Copie du texte dans le presse-papiers
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export default {
  formatFileSize,
  formatDate,
  formatRelativeDate,
  getFileIcon,
  getFileType,
  getTypeColor,
  validateName,
  validateEmail,
  validateUrl,
  searchInArray,
  filterArray,
  sortArray,
  calculateStats,
  calculateDistribution,
  getTopItems,
  generateId,
  deepClone,
  mergeObjects,
  getNestedValue,
  setNestedValue,
  debounce,
  throttle,
  retryWithBackoff,
  exportToJson,
  importFromJson,
  copyToClipboard
};
