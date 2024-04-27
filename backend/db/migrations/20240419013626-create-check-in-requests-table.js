'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CheckInRequests', {
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
        }
      },
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Book',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      handledAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CheckInRequests');
  }
};