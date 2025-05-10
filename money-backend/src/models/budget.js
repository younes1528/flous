import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Budget = sequelize.define('Budget', {
  total: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
});

export default Budget;
