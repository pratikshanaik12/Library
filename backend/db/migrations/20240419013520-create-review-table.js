'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Review', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        onDelete: 'CASCADE' // Ensures that reviews are deleted if the user is deleted
      },
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Book',
          key: 'id'
        },
        onDelete: 'CASCADE' // Ensures that reviews are deleted if the book is deleted
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true // Allowing null in case the user leaves a rating without a comment
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Review');
  }
};