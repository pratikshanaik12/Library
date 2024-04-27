'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt')

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
    }
  }
  
  User.init({
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username must be unique'
      },
      
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email address must be unique'
      },
      
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
     
    },
    role: {
      type: DataTypes.ENUM('librarian', 'customer'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a role'
        },
        isIn: {
          args: [['librarian', 'customer']],
          msg: 'Role must be either "librarian" or "customer"'
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'User',
    // paranoid: true, // Soft deletion
    freezeTableName: true,
  });

  return User;
};
