'use strict';
const { CheckInRequest, User, Book, sequelize } = require('../db/models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// POST: Create a new check-in request (customers only)
const createCheckInRequest = catchAsync(async (req, res, next) => {
    const { userId, bookId } = req.body;

    // Assuming the logged-in user's ID is stored in req.user.id
    if (req.user.role !== 'customer') {
        return next(new AppError('Only customers can create check-in requests', 403));
    }
    // Check if the book is checked out by the requesting user
    const book = await Book.findByPk(bookId);

    if (!book) {
        return next(new AppError('Book not found', 404));
    }

    if (book.checkedOutByUserId !== req.user.id) {
        return next(new AppError('You can only create a check-in request for a book checked out by you', 403));
    }


    const request = await CheckInRequest.create({
        userId: req.user.id, // Use logged-in user's ID
        bookId,
        status: 'pending' // Default status
    });

    res.status(201).json({
        status: 'success',
        data: {
            request
        }
    });
});

// GET: List all check-in requests (librarians only)
const getAllCheckInRequests = catchAsync(async (req, res, next) => {
    if (req.user.role !== 'librarian') {
        return next(new AppError('Only librarians can view all check-in requests', 403));
    }

    const requests = await CheckInRequest.findAll({
        include: [
            {
                model: User,
                as: 'user'
            },
            {
                model: Book,
                as: 'book'
            }
        ]
    });

    res.status(200).json({
        status: 'success',
        results: requests.length,
        data: {
            requests
        }
    });
});

// PATCH: Update the status of a check-in request (librarians only)
// PATCH: Update the status of a check-in request and update book availability (librarians only)
const updateCheckInRequest = catchAsync(async (req, res, next) => {
    if (req.user.role !== 'librarian') {
        return next(new AppError('Only librarians can update check-in requests', 403));
    }

    const { id } = req.params;
    const { status } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const request = await CheckInRequest.findByPk(id);
        if (!request) {
            await transaction.rollback();
            return next(new AppError('No request found with that ID', 404));
        }

        // Update request status
        request.status = status;
        request.handledAt = new Date();
        await request.save({ transaction });

        // Update book availability if the request is approved
        if (status === 'approved') {
            const book = await Book.findByPk(request.bookId);
            if (!book) {
                await transaction.rollback();
                return next(new AppError('No book found with that ID', 404));
            }

            book.available = true; // Set the book as available
            book.checkedOutByUserId = null; // Clear the user that had checked it out
            await book.save({ transaction });
        }

        await transaction.commit();

        res.status(200).json({
            status: 'success',
            data: {
                request,
                message: 'Check-in request and book status updated successfully'
            }
        });
    } catch (error) {
        await transaction.rollback();
        next(new AppError('Failed to update check-in request or book status', 500));
    }
});


module.exports = {createCheckInRequest, getAllCheckInRequests, updateCheckInRequest}