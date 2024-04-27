// customerRoute.js

const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../controller/authController');
const { addReview, getReviewById, editReview, deleteReview, getAllReviews } = require('../controller/reviewController');
const { checkOutBook, getCheckedOutBooksByUser } = require('../controller/bookController');
const { createCheckInRequest } = require('../controller/checkInRequestController');




// Middleware to protect routes and restrict them to authenticated users
router.use(protect);

router.use(restrictTo('customer'));

// Routes for handling reviews
router.post('/add-review', addReview); // Add a review

// Route to check out a book
router.post('/checkout-book/:id', checkOutBook); 
router.get('/checked-out-books-byUser', getCheckedOutBooksByUser);
router.get('/reviews/:id', getReviewById); // Get a review by ID
router.get('/reviews', getAllReviews); // Get a review by ID
router.patch('/edit-review/:id', editReview); // Edit a review
router.delete('/delete-review/:id', deleteReview); // Delete a review
router.post('/create-checkin-request', createCheckInRequest)





module.exports = router;