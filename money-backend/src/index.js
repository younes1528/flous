import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import sequelize, { testConnection } from './config/database.js';
import Budget from './models/budget.js';
import Item from './models/item.js';
import ProductType from './models/productType.js';

const app = express();
app.use(cors());
app.use(express.json());

// Budget routes
app.get('/api/budget', async (req, res) => {
  const budget = await Budget.findOne();
  res.json(budget || { total: 0 });
});

app.put('/api/budget', async (req, res) => {
  const budget = await Budget.findOne();
  if (budget) {
    await budget.update({ total: req.body.total });
  } else {
    await Budget.create({ total: req.body.total });
  }
  res.json({ total: req.body.total });
});

// Product Types routes
app.get('/api/categories', async (req, res) => {
  const types = await ProductType.findAll();
  res.json(types);
});

app.post('/api/categories', async (req, res) => {
  const type = await ProductType.create(req.body);
  res.json(type);
});

// Items routes
app.get('/api/items', async (req, res) => {
  const items = await Item.findAll({
    include: [{ model: ProductType, as: 'category' }]
  });
  res.json(items);
});

app.post('/api/items', async (req, res) => {
  const { name, price, categoryId } = req.body;
  const item = await Item.create({
    name,
    price,
    categoryId
  });
  const itemWithCategory = await Item.findByPk(item.id, {
    include: [{ model: ProductType, as: 'category' }]
  });
  res.json(itemWithCategory);
});

app.delete('/api/items/:id', async (req, res) => {
  await Item.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Initialize database with default categories
const initializeDb = async () => {
  try {
    // Force sync will drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('✅ Database tables recreated');
    
    const defaultCategories = [
      { name: 'Légumes', description: 'Produits végétaux frais' },
      { name: 'Fruits', description: 'Fruits frais et secs' },
      { name: 'Viandes', description: 'Protéines animales' },
      { name: 'Épicerie', description: 'Produits secs et conserves' },
      { name: 'Boissons', description: 'Boissons et liquides' }
    ];
    
    await Promise.all(
      defaultCategories.map(category => 
        ProductType.findOrCreate({
          where: { name: category.name },
          defaults: category
        })
      )
    );
    
    // Initialize budget
    await Budget.findOrCreate({
      where: {},
      defaults: { total: 0 }
    });

    console.log('✅ Default data initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Initialize database and start server
const startServer = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      process.exit(1);
    }
    
    await initializeDb();
    console.log('✅ Database initialized with default categories');
    
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Server initialization failed:', error);
    process.exit(1);
  }
};

startServer();
