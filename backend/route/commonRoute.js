// routes/commonRoutes.js

const express = require('express');
const router = express.Router();
const { getBookById, getAllBooks, searchBooks, getBooksSortedByRating, filterBooksByRating, filterBooksByAvailability, getFeaturedBooks } = require('../controller/bookController');
const { protect } = require('../controller/authController');

// Middleware to protect routes (authentication)
router.use(protect);

// Route to search books
router.get('/books/search', searchBooks);

// Route to view a book by ID
router.get('/books/:id', getBookById);

// Route to view all books
router.get('/books', getAllBooks);

router.get('/featured-books', getFeaturedBooks)

router.get('/books-sorted-by-rating', getBooksSortedByRating)

router.get('/books-filter-by-rating', filterBooksByRating)

router.get('/books-filter-by-availability', filterBooksByAvailability)



module.exports = router;
