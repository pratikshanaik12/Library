const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../controller/authController');
const { addBook, editBook, deleteBook, getAllCheckedOutBooks} = require('../controller/bookController');
const {deleteUser} = require('../controller/userController');
const { getAllCheckInRequests, updateCheckInRequest } = require('../controller/checkInRequestController');
const { upload } = require('../controller/bookController');


// Middleware to protect routes and restrict them to librarians only

router.use(protect);

router.use(restrictTo('librarian'));

router.post('/add-book', upload.single('coverImage'), addBook);

router.put('/edit-book/:id', upload.single('coverImage'), editBook);

router.delete('/delete-book/:id', deleteBook)

router.delete('/delete-user/:userId', deleteUser)

router.get('/get-checkin-request', getAllCheckInRequests)

router.patch('/update-checkin-request/:id', updateCheckInRequest)

router.get('/checked-out-books', getAllCheckedOutBooks);

module.exports = router;
