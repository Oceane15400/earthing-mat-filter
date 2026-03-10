/**
 * predicates.js - Fonctions de prédicat réutilisables pour les critères de filtrage
 */

/**
 * Vérifie si le prix du tapis est dans la plage spécifiée
 * @param {Object} mat - Objet tapis
 * @param {number} minPrice - Prix minimum
 * @param {number} maxPrice - Prix maximum
 * @returns {boolean}
 */
function priceRange(mat, minPrice, maxPrice) {
  const price = mat.price || 0;
  return price >= minPrice && price <= maxPrice;
}

/**
 * Vérifie si la conductivité dépasse le seuil minimum
 * @param {Object} mat - Objet tapis
 * @param {number} minConductivity - Conductivité minimale en S/m
 * @returns {boolean}
 */
function conductivityThreshold(mat, minConductivity) {
  const conductivity = mat.conductivity || 0;
  return conductivity >= minConductivity;
}

/**
 * Vérifie si le type d'usage correspond
 * @param {Object} mat - Objet tapis
 * @param {string} usage - Type d'usage recherché
 * @returns {boolean}
 */
function usageType(mat, usage) {
  if (!mat.usages || !Array.isArray(mat.usages)) {
    return false;
  }
  return mat.usages.includes(usage.toLowerCase());
}

/**
 * Vérifie si les dimensions sont dans les plages spécifiées
 * @param {Object} mat - Objet tapis
 * @param {number} minWidth - Largeur minimale
 * @param {number} maxWidth - Largeur maximale
 * @param {number} minLength - Longueur minimale
 * @param {number} maxLength - Longueur maximale
 * @returns {boolean}
 */
function dimensionRange(mat, minWidth, maxWidth, minLength, maxLength) {
  if (!mat.dimensions) {
    return false;
  }

  const { width, length } = mat.dimensions;
  const widthValid = width >= minWidth && width <= maxWidth;
  const lengthValid = length >= minLength && length <= maxLength;

  return widthValid && lengthValid;
}

/**
 * Vérifie si la marque du tapis correspond à une liste de marques
 * @param {Object} mat - Objet tapis
 * @param {Array<string>} brands - Tableau de marques
 * @returns {boolean}
 */
function brandMatch(mat, brands) {
  if (!mat.brand || !Array.isArray(brands)) {
    return false;
  }
  return brands.map(b => b.toLowerCase()).includes(mat.brand.toLowerCase());
}

/**
 * Vérifie si le matériau correspond
 * @param {Object} mat - Objet tapis
 * @param {string} material - Type de matériau
 * @returns {boolean}
 */
function materialType(mat, material) {
  if (!mat.material) {
    return false;
  }
  return mat.material.toLowerCase() === material.toLowerCase();
}

/**
 * Vérifie si le tapis possède une certification spécifique
 * @param {Object} mat - Objet tapis
 * @param {string} certification - Type de certification
 * @returns {boolean}
 */
function hasCertification(mat, certification) {
  if (!mat.certifications || !Array.isArray(mat.certifications)) {
    return false;
  }
  return mat.certifications.map(c => c.toUpperCase()).includes(certification.toUpperCase());
}

/**
 * Vérifie si le tapis a une note minimale
 * @param {Object} mat - Objet tapis
 * @param {number} minRating - Note minimale (0-5)
 * @returns {boolean}
 */
function minimumRating(mat, minRating) {
  const rating = mat.rating || 0;
  return rating >= minRating;
}

/**
 * Vérifie si le tapis est en stock
 * @param {Object} mat - Objet tapis
 * @returns {boolean}
 */
function inStock(mat) {
  return mat.inStock === true && (mat.quantity || 0) > 0;
}

/**
 * Vérifie si le tapis est certifié hypoallergénique
 * @param {Object} mat - Objet tapis
 * @returns {boolean}
 */
function isHypoallergenic(mat) {
  return mat.hypoallergenic === true;
}

// Exportation pour Node.js et navigateur
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    priceRange,
    conductivityThreshold,
    usageType,
    dimensionRange,
    brandMatch,
    materialType,
    hasCertification,
    minimumRating,
    inStock,
    isHypoallergenic
  };
}