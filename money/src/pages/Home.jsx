import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BudgetForm from '../components/BudgetForm';
import AddItemForm from '../components/AddItemForm';
import ItemsList from '../components/ItemsList';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/currency';

function BudgetSummary({ items, budget }) {
  const totalSpent = items.reduce((sum, item) => sum + Number(item.price), 0);
  const remaining = budget - totalSpent;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800">Budget Total</h3>
        <p className="text-2xl font-bold text-blue-900">{budget}€</p>
      </div>
      <div className="bg-green-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-800">Dépensé</h3>
        <p className="text-2xl font-bold text-green-900">{totalSpent}€</p>
      </div>
      <div className={`rounded-lg p-4 ${remaining >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
        <h3 className="text-lg font-semibold text-gray-800">Restant</h3>
        <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
          {remaining}€
        </p>
      </div>
    </div>
  );
}

BudgetSummary.propTypes = {
  items: PropTypes.array.isRequired,
  budget: PropTypes.number.isRequired
};

export default function Home({ items, budget, categories, onBudgetUpdate, onAddItem, onDeleteItem }) {
  const [categoryStats, setCategoryStats] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Calculate category stats and total spent
    const stats = {};
    let total = 0;

    items.forEach(item => {
      const catName = item.category?.name || 'Autre';
      stats[catName] = (stats[catName] || 0) + Number(item.price);
      total += Number(item.price);
    });

    setCategoryStats(stats);
    setTotalSpent(total);
    setRemaining(budget - total);
  }, [items, budget]);

  if (categories.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Mon Budget Courses</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p>Aucune catégorie n'est disponible. Veuillez vérifier la configuration du serveur.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-medium opacity-90">الميزانية الإجمالية</h3>
          <p className="text-3xl font-bold mt-2 text-right" dir="rtl">{formatCurrency(budget)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-medium opacity-90">المصروفات</h3>
          <p className="text-3xl font-bold mt-2 text-right" dir="rtl">{formatCurrency(totalSpent)}</p>
        </div>
        <div className={`rounded-xl p-6 text-white shadow-lg ${
          remaining >= 0 
            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
            : 'bg-gradient-to-br from-red-500 to-red-600'
        }`}>
          <h3 className="text-lg font-medium opacity-90">المتبقي</h3>
          <p className="text-3xl font-bold mt-2 text-right" dir="rtl">{formatCurrency(remaining)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">إضافة منتج</h2>
          <AddItemForm 
            categories={categories} 
            onAddItem={(item) => {
              onAddItem(item);
              setIsModalOpen(false);
            }} 
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">النفقات حسب الفئة</h2>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{category}</span>
                <span className="text-lg font-semibold" dir="rtl">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">قائمة المنتجات</h2>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="font-medium">{item.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{item.category?.name}</span>
                <span className="font-semibold" dir="rtl">{formatCurrency(item.price)}</span>
                <button 
                  onClick={() => onDeleteItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 sm:hidden h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        +
      </button>

      {/* Mobile Add Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un produit"
      >
        <AddItemForm 
          categories={categories} 
          onAddItem={(item) => {
            onAddItem(item);
            setIsModalOpen(false);
          }}
          isMobile={true}
        />
      </Modal>
    </div>
  );
}

Home.propTypes = {
  items: PropTypes.array.isRequired,
  budget: PropTypes.number.isRequired,
  categories: PropTypes.array.isRequired,
  onBudgetUpdate: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired
};
