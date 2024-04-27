// Assuming you have these models from your db/models setup
const { User, Book } = require('../db/models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const jwt = require('jsonwebtoken');


const deleteUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params; // The ID of the customer to be deleted

    // Check if the user making the request is a librarian
    if (req.user.role !== 'librarian') {
        return next(new AppError('Only a librarian can delete a customer.', 403));
    }

    // Retrieve the user to be deleted
    const userToDelete = await User.findByPk(userId);

    // Check if the user exists and is a customer
    if (!userToDelete) {
        return next(new AppError('User not found', 404));
    }
    if (userToDelete.role !== 'customer') {
        return next(new AppError('Only customers can be deleted', 403));
    }

    // Check if the customer has books checked out
    const booksCheckedOut = await Book.findAll({
        where: {
            checkedOutByUserId: userId
        }
    });

    if (booksCheckedOut.length > 0) {
        return next(new AppError('Cannot delete a customer who has books checked out.', 400));
    }

    // If all checks pass, proceed with user deletion
    await userToDelete.destroy();
    res.status(204).json({
        status: 'success',
        message: 'Customer was successfully deleted',
        data: null
    });
});

// Existing module.exports with your other controller functions
module.exports = {
    // ... other exported functions,
    deleteUser
};
