'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Book', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      author: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      publisher: {
        allowNull: false,
        type: Sequelize.STRING
      },
      publicationDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isbn: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      pageCount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      available: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      checkOutDate: {
        type: Sequelize.DATE
      },
      checkedOutByUserId: {
        type: Sequelize.INTEGER,
        allowNull: true, // Nullable because initially not checked out
        references: {
          model: 'User', // Assuming 'Users' is the name of your user table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      coverImage: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Book');
  }
};