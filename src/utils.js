/**
 * utils.js - Fonctions utilitaires pour formatage et calculs
 */

/**
 * Formate un prix en euros avec symbole et décimales
 * @param {number} price - Prix en euros
 * @param {string} locale - Locale pour le formatage (défaut: 'fr-FR')
 * @returns {string}
 */
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

/**
 * Calcule la conductivité effective basée sur le matériau et l'épaisseur
 * @param {string} material - Type de matériau
 * @param {number} thickness - Épaisseur en mm
 * @returns {number} Conductivité en S/m
 */
function calculateConductivity(material, thickness) {
  const baseConductivity = {
    'argent': 6.3e7,
    'carbone': 3e4,
    'nickel': 1.43e7,
    'titane': 2.38e6,
    'cuivre': 5.96e7
  };

  const conductivity = baseConductivity[material.toLowerCase()] || 1e4;
  
  // Ajustement basé sur l'épaisseur (plus épais = meilleure conductivité)
  const thicknessMultiplier = 1 + (thickness / 10);
  
  return conductivity * thicknessMultiplier;
}

/**
 * Calcule la surface du tapis en m²
 * @param {number} width - Largeur en cm
 * @param {number} length - Longueur en cm
 * @returns {number} Surface en m²
 */
function calculateSurface(width, length) {
  return (width * length) / 10000;
}

/**
 * Formate les dimensions pour l'affichage
 * @param {Object} dimensions - Objet avec width et length
 * @returns {string}
 */
function formatDimensions(dimensions) {
  if (!dimensions || !dimensions.width || !dimensions.length) {
    return 'N/A';
  }
  return `${dimensions.width} cm × ${dimensions.length} cm`;
}

/**
 * Calcule le ratio prix/surface
 * @param {number} price - Prix en euros
 * @param {number} width - Largeur en cm
 * @param {number} length - Longueur en cm
 * @returns {number} Prix par m²
 */
function calculatePricePerSquareMeter(price, width, length) {
  const surface = calculateSurface(width, length);
  if (surface === 0) return 0;
  return price / surface;
}

/**
 * Évalue la qualité globale d'un tapis (0-100)
 * @param {Object} mat - Objet tapis
 * @returns {number}
 */
function evaluateQualityScore(mat) {
  let score = 0;
  let factors = 0;

  // Conductivité (max 30 points)
  if (mat.conductivity) {
    score += Math.min(30, (mat.conductivity / 1e6) * 10);
    factors++;
  }

  // Note utilisateur (max 25 points)
  if (mat.rating) {
    score += (mat.rating / 5) * 25;
    factors++;
  }

  // Certifications (max 25 points)
  if (mat.certifications && Array.isArray(mat.certifications)) {
    score += Math.min(25, mat.certifications.length * 8);
    factors++;
  }

  // Épaisseur (max 20 points)
  if (mat.thickness) {
    score += Math.min(20, (mat.thickness / 10) * 20);
    factors++;
  }

  return factors > 0 ? Math.round(score / factors) : 0;
}

/**
 * Formate la conductivité pour l'affichage
 * @param {number} conductivity - Conductivité en S/m
 * @returns {string}
 */
function formatConductivity(conductivity) {
  if (conductivity >= 1e7) {
    return `${(conductivity / 1e7).toFixed(2)} × 10⁷ S/m`;
  } else if (conductivity >= 1e6) {
    return `${(conductivity / 1e6).toFixed(2)} × 10⁶ S/m`;
  } else if (conductivity >= 1e3) {
    return `${(conductivity / 1e3).toFixed(2)} × 10³ S/m`;
  }
  return `${conductivity.toFixed(2)} S/m`;
}

/**
 * Valide un objet tapis
 * @param {Object} mat - Objet à valider
 * @returns {boolean}
 */
function isValidMat(mat) {
  return (
    mat &&
    typeof mat === 'object' &&
    mat.id &&
    mat.name &&
    typeof mat.price === 'number' &&
    mat.price >= 0
  );
}

/**
 * Crée un résumé textuel du tapis
 * @param {Object} mat - Objet tapis
 * @returns {string}
 */
function generateMatSummary(mat) {
  const parts = [];
  
  if (mat.name) parts.push(mat.name);
  if (mat.brand) parts.push(`Marque: ${mat.brand}`);
  if (mat.price) parts.push(`Prix: ${formatPrice(mat.price)}`);
  if (mat.dimensions) parts.push(`Dimensions: ${formatDimensions(mat.dimensions)}`);
  if (mat.material) parts.push(`Matériau: ${mat.material}`);
  if (mat.rating) parts.push(`Note: ${mat.rating}/5`);

  return parts.join(' | ');
}

// Exportation pour Node.js et navigateur
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatPrice,
    calculateConductivity,
    calculateSurface,
    formatDimensions,
    calculatePricePerSquareMeter,
    evaluateQualityScore,
    formatConductivity,
    isValidMat,
    generateMatSummary
  };
}