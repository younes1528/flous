import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProductType = sequelize.define('ProductType', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

export default ProductType;
