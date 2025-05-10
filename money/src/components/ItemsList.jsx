import PropTypes from 'prop-types';

export default function ItemsList({ items, onDeleteItem }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Liste des produits</h2>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <span className="font-medium">{item.name}</span>
            <span className="text-gray-600">{item.category?.name}</span>
            <div>
              <span className="font-semibold mr-3">{item.price}€</span>
              <button 
                onClick={() => onDeleteItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ItemsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      category: PropTypes.shape({
        name: PropTypes.string
      })
    })
  ).isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};
