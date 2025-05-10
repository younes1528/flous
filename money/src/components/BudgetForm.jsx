import PropTypes from 'prop-types';

export default function BudgetForm({ budget, onBudgetUpdate }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Budget Total</h2>
      <input 
        type="number" 
        value={budget}
        onChange={(e) => onBudgetUpdate(Number(e.target.value))}
        placeholder="Entrez votre budget"
        className="w-full p-2 border rounded-md"
      />
    </div>
  );
}

BudgetForm.propTypes = {
  budget: PropTypes.number.isRequired,
  onBudgetUpdate: PropTypes.func.isRequired,
};
