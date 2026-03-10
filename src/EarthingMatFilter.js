/**
 * EarthingMatFilter - Classe principale pour filtrer et comparer les tapis de mise à la terre
 * @class EarthingMatFilter
 */

const predicates = require('./predicates');
const utils = require('./utils');

class EarthingMatFilter {
  /**
   * Constructeur du filtre
   * @param {Array<Object>} mats - Tableau de tapis de mise à la terre
   */
  constructor(mats = []) {
    this.mats = mats;
    this.filters = [];
    this.sortConfig = null;
  }

  /**
   * Ajoute un filtre par prix
   * @param {number} minPrice - Prix minimum en euros
   * @param {number} maxPrice - Prix maximum en euros
   * @returns {EarthingMatFilter} - Retourne this pour le chaînage
   */
  byPriceRange(minPrice, maxPrice) {
    this.filters.push(mat => predicates.priceRange(mat, minPrice, maxPrice));
    return this;
  }

  /**
   * Ajoute un filtre par conductivité minimale
   * @param {number} minConductivity - Conductivité minimale en Siemens/mètre
   * @returns {EarthingMatFilter}
   */
  byConductivity(minConductivity) {
    this.filters.push(mat => predicates.conductivityThreshold(mat, minConductivity));
    return this;
  }

  /**
   * Ajoute un filtre par type d'usage
   * @param {string} usage - Type d'usage ('personnel', 'professionnel', 'médical', 'industriel')
   * @returns {EarthingMatFilter}
   */
  byUsage(usage) {
    this.filters.push(mat => predicates.usageType(mat, usage));
    return this;
  }

  /**
   * Ajoute un filtre par dimensions
   * @param {number} minWidth - Largeur minimale en cm
   * @param {number} maxWidth - Largeur maximale en cm
   * @param {number} minLength - Longueur minimale en cm
   * @param {number} maxLength - Longueur maximale en cm
   * @returns {EarthingMatFilter}
   */
  byDimensions(minWidth, maxWidth, minLength, maxLength) {
    this.filters.push(mat => 
      predicates.dimensionRange(mat, minWidth, maxWidth, minLength, maxLength)
    );
    return this;
  }

  /**
   * Ajoute un filtre par marque
   * @param {Array<string>} brands - Tableau de marques
   * @returns {EarthingMatFilter}
   */
  byBrand(brands) {
    this.filters.push(mat => predicates.brandMatch(mat, brands));
    return this;
  }

  /**
   * Ajoute un filtre par matériau
   * @param {string} material - Type de matériau ('carbone', 'argent', 'nickel', 'titane')
   * @returns {EarthingMatFilter}
   */
  byMaterial(material) {
    this.filters.push(mat => predicates.materialType(mat, material));
    return this;
  }

  /**
   * Ajoute un filtre par certification
   * @param {string} certification - Type de certification ('CE', 'ISO', 'FDA')
   * @returns {EarthingMatFilter}
   */
  byCertification(certification) {
    this.filters.push(mat => predicates.hasCertification(mat, certification));
    return this;
  }

  /**
   * Configure le tri des résultats
   * @param {string} field - Champ à trier ('price', 'conductivity', 'rating', 'dimensions')
   * @param {string} order - Ordre de tri ('asc', 'desc')
   * @returns {EarthingMatFilter}
   */
  sortBy(field, order = 'asc') {
    this.sortConfig = { field, order };
    return this;
  }

  /**
   * Exécute tous les filtres et retourne les résultats
   * @returns {Array<Object>} - Tableau de tapis filtrés
   */
  execute() {
    let results = [...this.mats];

    // Applique tous les filtres
    results = results.filter(mat => 
      this.filters.every(filter => filter(mat))
    );

    // Applique le tri si configuré
    if (this.sortConfig) {
      results = this._applySort(results);
    }

    return results;
  }

  /**
   * Applique le tri aux résultats
   * @private
   * @param {Array<Object>} results - Résultats à trier
   * @returns {Array<Object>}
   */
  _applySort(results) {
    const { field, order } = this.sortConfig;
    const isAscending = order === 'asc';

    return results.sort((a, b) => {
      let aValue, bValue;

      switch (field) {
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'conductivity':
          aValue = a.conductivity || 0;
          bValue = b.conductivity || 0;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'dimensions':
          aValue = (a.dimensions?.width || 0) * (a.dimensions?.length || 0);
          bValue = (b.dimensions?.width || 0) * (b.dimensions?.length || 0);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return isAscending ? -1 : 1;
      if (aValue > bValue) return isAscending ? 1 : -1;
      return 0;
    });
  }

  /**
   * Réinitialise tous les filtres
   * @returns {EarthingMatFilter}
   */
  reset() {
    this.filters = [];
    this.sortConfig = null;
    return this;
  }

  /**
   * Retourne le nombre de résultats sans exécuter
   * @returns {number}
   */
  count() {
    return this.execute().length;
  }

  /**
   * Retourne les statistiques des résultats filtrés
   * @returns {Object}
   */
  getStatistics() {
    const results = this.execute();
    
    if (results.length === 0) {
      return {
        count: 0,
        avgPrice: 0,
        avgConductivity: 0,
        avgRating: 0
      };
    }

    const avgPrice = results.reduce((sum, mat) => sum + (mat.price || 0), 0) / results.length;
    const avgConductivity = results.reduce((sum, mat) => sum + (mat.conductivity || 0), 0) / results.length;
    const avgRating = results.reduce((sum, mat) => sum + (mat.rating || 0), 0) / results.length;

    return {
      count: results.length,
      avgPrice: utils.formatPrice(avgPrice),
      avgConductivity: avgConductivity.toFixed(2),
      avgRating: avgRating.toFixed(2)
    };
  }
}

// Exportation pour Node.js et navigateur
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EarthingMatFilter;
}