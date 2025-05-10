import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/currency';

export default function Statistics({ items, categories }) {
  const categoryTotals = items.reduce((acc, item) => {
    const catName = item.category?.name || 'Autre';
    acc[catName] = (acc[catName] || 0) + Number(item.price);
    return acc;
  }, {});

  const monthlyTotals = items.reduce((acc, item) => {
    const date = new Date(item.createdAt);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + Number(item.price);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">الإحصائيات</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">النفقات حسب الفئة</h3>
          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([category, total]) => (
              <div key={category} className="flex items-center gap-2">
                <span className="font-medium">{category}</span>
                <span className="font-bold text-right" dir="rtl">{formatCurrency(total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">التطور الشهري</h3>
          <div className="space-y-3">
            {Object.entries(monthlyTotals).map(([month, total]) => (
              <div key={month} className="flex items-center gap-2">
                <span className="w-20">{month}</span>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ 
                        width: `${(total / Math.max(...Object.values(monthlyTotals))) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                <span className="w-24 text-right font-bold">{total.toFixed(2)}€</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Statistics.propTypes = {
  items: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired
};
