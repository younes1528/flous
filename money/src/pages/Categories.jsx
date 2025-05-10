import PropTypes from 'prop-types';
import { useState } from 'react';

export default function Categories({ categories, onAddCategory, onDeleteCategory }) {
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.name) {
      onAddCategory?.(newCategory);
      setNewCategory({ name: '', description: '' });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion des catégories</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Ajouter une catégorie</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Nom de la catégorie"
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              placeholder="Description (optionnel)"
              className="w-full px-4 py-2 rounded-lg border h-24"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Ajouter
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Catégories existantes</h3>
        <div className="divide-y">
          {categories.map(category => (
            <div key={category.id} className="py-3 flex justify-between items-center">
              <div>
                <h4 className="font-medium">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-gray-500">{category.description}</p>
                )}
              </div>
              <button
                onClick={() => onDeleteCategory?.(category.id)}
                className="text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Categories.propTypes = {
  categories: PropTypes.array.isRequired,
  onAddCategory: PropTypes.func,
  onDeleteCategory: PropTypes.func
};
