'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Model {
    static associate(models) {
      // Define associations here
      Book.hasMany(models.Review, { foreignKey: 'bookId' });
    }
  }
  
  Book.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    author: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    publisher: {
      allowNull: false,
      type: DataTypes.STRING
    },
    publicationDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    category: {
      allowNull: false,
      type: DataTypes.STRING
    },
    isbn: {
      allowNull: false,
      unique: {
        args: true,
        msg: 'ISBN must be unique'
      },
      type: DataTypes.STRING
    },
    pageCount: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    available: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    checkOutDate: {
      type: DataTypes.DATE
    },
    checkedOutByUserId: {
      type: DataTypes.INTEGER, // Assuming userId is an integer
      allowNull: true, // Nullable because initially not checked out
    },
    coverImage: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Book',
    tableName: 'Book', 
  });

  return Book;
};
