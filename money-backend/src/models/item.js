import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import ProductType from './productType.js';

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: ProductType,
      key: 'id'
    }
  }
});

// Define the association after both models are initialized
Item.belongsTo(ProductType, { 
  as: 'category',
  foreignKey: 'categoryId'
});

export default Item;
