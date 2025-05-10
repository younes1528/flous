import { useState } from 'react';
import PropTypes from 'prop-types';

export default function Settings({ currentBudget, onBudgetUpdate }) {
  const [settings, setSettings] = useState({
    notifications: true,
    currency: 'EUR',
    language: 'fr',
    theme: 'light'
  });
  const [budgetValue, setBudgetValue] = useState(currentBudget || 0);
  const [error, setError] = useState('');

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (typeof onBudgetUpdate !== 'function') {
        throw new Error('Budget update function not provided');
      }
      
      const newBudget = Number(budgetValue);
      if (isNaN(newBudget) || newBudget < 0) {
        throw new Error('Le budget doit être un nombre positif');
      }

      await onBudgetUpdate(newBudget);
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du budget');
      console.error('Budget update error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Paramètres</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Budget Mensuel</h3>
        <form onSubmit={handleBudgetSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant du budget
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={budgetValue}
                onChange={(e) => setBudgetValue(e.target.value)}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500`}
                min="0"
                step="0.01"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Mettre à jour
              </button>
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span>Activer les notifications</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Devise
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
            >
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar ($)</option>
              <option value="GBP">Livre (£)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Langue
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thème
            </label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="system">Système</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

Settings.propTypes = {
  currentBudget: PropTypes.number,
  onBudgetUpdate: PropTypes.func.isRequired
};

Settings.defaultProps = {
  currentBudget: 0
};
