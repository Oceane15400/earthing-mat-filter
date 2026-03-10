# Earthing Mat Filter

## Description

**Earthing Mat Filter** est une librairie JavaScript minimaliste et performante pour filtrer et comparer les tapis de mise à la terre. Elle permet aux utilisateurs de trouver rapidement le modèle adapté à leurs besoins selon des critères essentiels : prix, conductivité, usage (bureau, sommeil, portable) et dimensions.

Conçue pour les sites de contenu comparatif, cette librairie offre une expérience utilisateur fluide sans dépendances externes. Elle gère intelligemment les filtres multiples et propose un système de tri flexible pour classer les résultats par pertinence.

## Installation

```bash
npm install earthing-mat-filter
```

Ou inclure directement dans votre HTML :

```html
<script src="dist/earthingMatFilter.min.js"></script>
```

## Utilisation

### Initialisation simple

```javascript
import EarthingMatFilter from 'earthing-mat-filter';

const filter = new EarthingMatFilter(matsData);

// Filtrer par prix
const affordable = filter.filterByPrice(0, 200);

// Filtrer par conductivité (en Ohms)
const conductive = filter.filterByConductivity(0, 100);

// Combiner plusieurs critères
const results = filter
  .filterByPrice(100, 300)
  .filterByUsage(['bureau', 'sommeil'])
  .filterByDimensions(80, 200)
  .sort('price', 'asc');
```

### Utilisation avancée

```javascript
// Utiliser des prédicats personnalisés
const results = filter.filterByPredicate(mat => 
  mat.price < 250 && mat.conductivity < 100 && mat.material === 'carbon'
);

// Réinitialiser et recommencer
filter.reset();

// Obtenir les statistiques
const stats = filter.getStats();
console.log(stats.averagePrice, stats.minConductivity);
```

### Exemple d'intégration HTML

```html
<!DOCTYPE html>
<html>
<head>
  <script src="dist/earthingMatFilter.min.js"></script>
</head>
<body>
  <input type="range" id="priceFilter" min="50" max="500">
  <button onclick="applyFilter()">Filtrer</button>
  <div id="results"></div>

  <script>
    const filter = new EarthingMatFilter(matsDatabase);
    
    function applyFilter() {
      const price = document.getElementById('priceFilter').value;
      const results = filter.filterByPrice(0, price);
      displayResults(results);
    }
  </script>
</body>
</html>
```

## Caractéristiques

- ✅ **Zéro dépendance** : Aucune librairie externe requise
- ✅ **Chaînable** : Enchaîner les filtres pour une meilleure lisibilité
- ✅ **Performant** : Optimisé pour les datasets volumineux
- ✅ **Flexible** : Prédicats réutilisables et extensibles
- ✅ **Utilitaires inclus** : Formatage de prix, calcul de conductivité

Cette librairie est inspirée par les besoins concrets de [https://tapis-earthing.fr](https://tapis-earthing.fr), le site francophone de référence sur les tapis de mise à la terre, qui aide ses lecteurs à comparer les modèles et choisir le produit idéal.

## API Complète

Consultez la documentation des fichiers `src/EarthingMatFilter.js`, `src/predicates.js` et `src/utils.js` pour l'API détaillée.

## License

MIT