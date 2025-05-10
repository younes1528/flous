import { useState, useEffect } from 'react'
import axios from 'axios'
import Home from './pages/Home'
import ErrorMessage from './components/ErrorMessage'
import Layout from './components/Layout'
import { Routes, Route } from 'react-router-dom';
import Statistics from './pages/Statistics';
import Categories from './pages/Categories';
import History from './pages/History';
import Settings from './pages/Settings';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [items, setItems] = useState([]);
  const [budget, setBudget] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [budgetRes, itemsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/budget`),
        axios.get(`${API_URL}/items`),
        axios.get(`${API_URL}/categories`)
      ]);
      setBudget(budgetRes.data.total);
      setItems(itemsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      setError(
        error.code === 'ERR_NETWORK' 
          ? 'Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution.'
          : 'Une erreur est survenue lors du chargement des données.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetUpdate = async (newBudget) => {
    try {
      await axios.put(`${API_URL}/budget`, { total: newBudget });
      setBudget(newBudget);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du budget:', error);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      const response = await axios.post(`${API_URL}/items`, {
        name: newItem.name,
        price: Number(newItem.price),
        categoryId: Number(newItem.categoryId)
      });
      setItems([...items, response.data]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/items/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage message={error} />
        <button 
          onClick={loadData}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Réessayer
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              items={items}
              budget={budget}
              categories={categories}
              onBudgetUpdate={handleBudgetUpdate}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
            />
          } 
        />
        <Route 
          path="/statistics" 
          element={<Statistics items={items} categories={categories} />} 
        />
        <Route 
          path="/history" 
          element={<History items={items} />} 
        />
        <Route 
          path="/categories" 
          element={<Categories categories={categories} />} 
        />
        <Route 
          path="/settings" 
          element={
            <Settings 
              currentBudget={budget}
              onBudgetUpdate={handleBudgetUpdate}
            />
          } 
        />
      </Routes>
    </Layout>
  );
}

export default App
