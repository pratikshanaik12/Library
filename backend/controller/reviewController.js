// controller/bookController.js

const { Review } = require('../db/models');
const AppError = require('../utils/appError');
const {validateReview} = require('../utils/reviewValidation')
const catchAsync = require('../utils/catchAsync');

const addReview = catchAsync(async (req, res, next) => {
    // Validate the request body using validateReview function
    const errors = validateReview(req.body);
    if (errors) {
        const message = errors.join(', ');
        return next(new AppError(message, 400));
    }

    // Extract fields from the request body
    const { userId, bookId, rating, comment } = req.body;

    // Create and save the new review record
    const review = await Review.create({
        userId: userId,
        bookId: bookId,
        rating: rating,
        comment: comment
    });

    res.status(201).json({
        status: 'success',
        data: { review }
    });
});

const editReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
        return next(new AppError('Review ID is missing or invalid', 400));
    }

    // Validate the request body using validateReview function
    const errors = validateReview(req.body);
    if (errors) {
        const message = errors.join(', ');
        return next(new AppError(message, 400));
    }

    // Find the review by ID
    let review = await Review.findByPk(id);

    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    // Update the review fields
    const { rating, comment } = req.body;

    review.rating = rating;
    review.comment = comment;

    // Save the updated review record
    review = await review.save();

    res.status(200).json({
        status: 'success',
        data: { review }
    });
});

const getReviewById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
        return next(new AppError('Review ID is missing or invalid', 400));
    }

    // Fetch the review by ID
    const review = await Review.findByPk(id);

    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { review }
    });
});

const getAllReviews = catchAsync(async (req, res, next) => {
    // Fetch all reviews
    const reviews = await Review.findAll();

    res.status(200).json({
        status: 'success',
        data: { reviews }
    });
});

const deleteReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
        return next(new AppError('Review ID is missing or invalid', 400));
    }

    // Find the review by ID
    const review = await Review.findByPk(id);

    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    // Delete the review
    await review.destroy();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

module.exports = {
    addReview,
    editReview,
    getReviewById,
    deleteReview,
    getAllReviews

};
