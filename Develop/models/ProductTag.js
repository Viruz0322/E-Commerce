const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      //accepts unique values for each row
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      refence: {
        model: 'Product',
        key: 'id',
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      reference: {
        model: 'Tag',
        key: 'id',
      },
    },
  },



  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
