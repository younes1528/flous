import PropTypes from 'prop-types';

export default function History({ items }) {
  const groupedByDate = items.reduce((acc, item) => {
    const date = new Date(item.createdAt).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Historique des achats</h2>

      {Object.entries(groupedByDate).map(([date, dateItems]) => (
        <div key={date} className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{date}</h3>
            <span className="text-lg font-bold">
              Total: {dateItems.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2)}€
            </span>
          </div>
          <div className="divide-y">
            {dateItems.map(item => (
              <div key={item.id} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-2 text-sm text-gray-500">{item.category?.name}</span>
                </div>
                <span className="font-semibold">{item.price}€</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

History.propTypes = {
  items: PropTypes.array.isRequired
};
