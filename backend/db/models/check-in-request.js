'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class CheckInRequest extends Model {
        static associate(models) {
            // Define association here
            CheckInRequest.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });
            CheckInRequest.belongsTo(models.Book, {
                foreignKey: 'bookId',
                as: 'book'
            });
        }
    }

    CheckInRequest.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User', // name of Target model
                key: 'id',     // key in Target model that we're referencing
            }
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Book', // name of Target model
                key: 'id',     // key in Target model that we're referencing
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        handledAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
        ,
        dueDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    
    
    {
        sequelize,
        modelName: 'CheckInRequest',
        tableName: 'CheckInRequests',
        freezeTableName: true,
        timestamps: false, // If you are explicitly declaring createdAt, updatedAt, or deletedAt
    });

    return CheckInRequest;
};
