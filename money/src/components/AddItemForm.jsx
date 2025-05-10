import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/currency';

const commonProducts = {
  'legumes': ['Carottes', 'Pommes de terre', 'Oignons', 'Tomates', 'Salade'],
  'fruits': ['Pommes', 'Bananes', 'Oranges', 'Fraises', 'Raisins'],
  'viandes': ['Poulet', 'Boeuf haché', 'Jambon', 'Saucisses', 'Poisson'],
  'epicerie': ['Pâtes', 'Riz', 'Pain', 'Lait', 'Oeufs']
};

export default function AddItemForm({ categories, onAddItem, isMobile }) {
  const [newItem, setNewItem] = useState({ name: '', price: '', categoryId: '' });
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (newItem.categoryId && newItem.name.length > 0) {
      const category = categories.find(c => c.id === Number(newItem.categoryId));
      if (category) {
        const categoryProducts = commonProducts[category.name.toLowerCase()] || [];
        const filtered = categoryProducts.filter(p => 
          p.toLowerCase().includes(newItem.name.toLowerCase())
        );
        setSuggestions(filtered);
      }
    } else {
      setSuggestions([]);
    }
  }, [newItem.name, newItem.categoryId, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!newItem.name.trim()) validationErrors.name = 'Nom requis';
    if (!newItem.price) validationErrors.price = 'Prix requis';
    if (!newItem.categoryId) validationErrors.categoryId = 'Catégorie requise';

    if (Object.keys(validationErrors).length === 0) {
      onAddItem(newItem);
      setNewItem({ name: '', price: '', categoryId: '' });
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Produit
        </label>
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => {
            setNewItem({...newItem, name: e.target.value});
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } shadow-sm focus:ring-2 focus:ring-blue-500`}
          placeholder="Nom du produit"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                onClick={() => {
                  setNewItem({...newItem, name: suggestion});
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            value={newItem.categoryId}
            onChange={(e) => setNewItem({...newItem, categoryId: e.target.value})}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Sélectionner</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            السعر (درهم)
          </label>
          <input
            type="number"
            step="0.01"
            value={newItem.price}
            onChange={(e) => setNewItem({...newItem, price: e.target.value})}
            className={`w-full px-4 py-3 rounded-lg border text-right ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:ring-2 focus:ring-blue-500`}
            placeholder="٠.٠٠"
            dir="rtl"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => {
            setNewItem({ name: '', price: '', categoryId: '' });
            setErrors({});
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Effacer
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
}

AddItemForm.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  ).isRequired,
  onAddItem: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
};

AddItemForm.defaultProps = {
  isMobile: false
};
