'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Review extends Model {
    static associate(models) {
      // Define associations here
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
      Review.belongsTo(models.Book, {
        foreignKey: 'bookId',
        onDelete: 'CASCADE'
      });
    }
  }
  
  Review.init({
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Review',
    freezeTableName: true,
  });

  return Review;
};
