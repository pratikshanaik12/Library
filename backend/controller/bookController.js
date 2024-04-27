const { Book, User, Review, sequelize, CheckInRequest } = require('../db/models');
const AppError = require('../utils/appError');
const { validateBook } = require('../utils/bookValidation');
const catchAsync = require('../utils/catchAsync');
const { Op } = require('sequelize');
const multer = require('multer');
const { bucket } = require('../utils/firebaseAdmin');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const defaultCoverImageUrl = 'https://images.pexels.com/photos/45718/pexels-photo-45718.jpeg'; 

const addBook = catchAsync(async (req, res, next) => {
    
    
    const { title, author, description, publisher, publicationDate, category, isbn, pageCount } = req.body;
    
    const { errors } = validateBook(req.body);
    if (errors.length > 0) {
        const message = errors.join(', ');
        return next(new AppError(message, 400));
    }
    let coverImageUrl = defaultCoverImageUrl;
   
    if (req.file) {
        const filename = `${Date.now()}_${req.file.originalname}`;
        const blob = bucket.file(filename);

        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });
        

        blobWriter.on('error', (err) => next(err));
        
        blobWriter.end(req.file.buffer)

        blobWriter.on('finish', async () => {
            
            // Make the file public and get the public URL
            await blob.makePublic();
            coverImageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            

            // Create and save the new book record with the cover image URL
            const book = await Book.create({
                title,
                author,
                description,
                publisher,
                publicationDate,
                category,
                isbn,
                pageCount,
                coverImage: coverImageUrl,
                available: true,
                checkOutDate: null,
                createdAt: new Date(),
                updatedAt: null,
                checkedOutByUserId: null,
            });


            res.status(201).json({
                status: 'success',
                data: { book }
            });
        });
    } else {
        // If no file is uploaded, create the new book record with the default cover image URL
        const book = await Book.create({
            title,
            author,
            description,
            publisher,
            publicationDate,
            category,
            isbn,
            pageCount,
            coverImage: coverImageUrl,
            available: true,
            checkOutDate: null,
            createdAt: new Date(),
            updatedAt: null, 
            checkedOutByUserId: null,
        });

        res.status(201).json({
            status: 'success',
            data: { book }
        });
    }
});


const getBookById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
        return next(new AppError('Book ID is missing', 400));
    }

    try {
        // Fetch the book by ID including associated data
        const book = await Book.findByPk(id, {
            include: [
                { model: Review, include: [User] } // Include the User who left the review
            ]
        });

        if (!book) {
            return next(new AppError('Book not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { book }
        });
    } catch (error) {
        return next(new AppError('Error occurred while fetching the book', 500));
    }
});


const getAllBooks = catchAsync(async (req, res, next) => {
    
    let books = await Book.findAll()

    if (!books) {
        return next(new AppError('No books found', 404));
    }

    if(books.length === 0){
        books = []
    }

    res.status(200).json({
        status: 'success',
        data: { books }
    });
});


const searchBooks = catchAsync(async (req, res, next) => {
    // Validate the search parameters
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
        return next(new AppError('Invalid search query. Please provide a valid string.', 400));
    }

    // Search for books where title or author matches the query
    const books = await Book.findAll({
        where: {
            [Op.or]: [
                { title: { [Op.iLike]: `%${query}%` } }, // Case-insensitive matching for titles
                { author: { [Op.iLike]: `%${query}%` } } // Case-insensitive matching for authors
            ]
        }
    });

    if (!books.length) {
        return next(new AppError('No books found matching the search query', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { books }
    });
});

const editBook = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
        return next(new AppError('Book ID is missing or invalid', 400));
    }

    // Validate the request body first
    const { error } = validateBook(req.body);
    if (error) {
        const message = error.details.map(i => i.message).join(', ');
        return next(new AppError(message, 400));
    }

    // Find the book by ID
    let book = await Book.findByPk(id);

    if (!book) {
        return next(new AppError('Book not found', 404));
    }

    // Update the book fields
    const { title, author, description, isbn, publisher, publicationDate, category, pageCount, coverImage } = req.body;

    book.title = title;
    book.author = author;
    book.description = description;
    book.isbn = isbn;
    book.publisher = publisher;
    book.publicationDate = publicationDate;
    book.category = category;
    book.pageCount = pageCount;
    book.coverImage = coverImage;

    // Check if a new cover image file is uploaded
    if (!req.file) {
        // Assuming file handling and URL generation is done here
        book.coverImage = defaultCoverImageUrl
    } else{
         // If no new file is uploaded, the existing coverImage remains unchanged
    
    let coverImageUrl = await uploadFileToStorage(req.file); // Implement this function as needed
    book.coverImage = coverImageUrl;

    }
   
    // Save the updated book record
    await book.save();

    // Save the updated book record
    book = await book.save();

    res.status(200).json({
        status: 'success',
        data: { book }
    });
});

async function uploadFileToStorage(file) {
    const filename = `${Date.now()}_${file.originalname}`;
    const blob = bucket.file(filename);

    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });

    return new Promise((resolve, reject) => {
        blobStream.on('error', err => reject(err));
        blobStream.on('finish', async () => {
            // Make the file public and get the URL
            await blob.makePublic();
            const url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(url);
        });
        blobStream.end(file.buffer);
    });
}

const deleteBook = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
        return next(new AppError('Book ID is missing or invalid', 400));
    }

    // Find the book by ID
    const book = await Book.findByPk(id);

    if (!book) {
        return next(new AppError('Book not found', 404));
    }

    // Check if the book has ever been checked out
    const checkInRequest = await CheckInRequest.findOne({
        where: {
            bookId: id,
            status: 'approved' // Assuming 'approved' status means the book was checked out but has been returned
        }
    });

    if (checkInRequest) {
        // Book has been checked out and returned, proceed with deletion
        await book.destroy();

        res.status(200).json({
            status: 'success',
            data: null
        });
    } else {
        // No check-in requests found, meaning the book has never been checked out
        // You can proceed with deleting the book directly
        await book.destroy();

        res.status(200).json({
            status: 'success',
            data: null
        });
    }
});


const checkOutBook = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.body; // Assuming userId is provided in the request body

    if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
        return next(new AppError('Book ID is missing or invalid', 400));
    }

    if (!userId) {
        return next(new AppError('User ID is missing', 400));
    }

    // Find the book by ID
    const book = await Book.findByPk(id);

    if (!book) {
        return next(new AppError('Book not found', 404));
    }

    // Check if the book is already checked out
    if (book.checkedOutByUserId !== null) {
        return next(new AppError('Book is already checked out by another user', 400));
    }

    // Update the book's checkedOutByUserId with the user's ID
    book.checkedOutByUserId = userId;
    // Set the check-out date
    book.checkOutDate = new Date();

    // Set the book as unavailable
     book.available = false;

    // Save the updated book record
    await book.save();

    res.status(200).json({
        status: 'success',
        message: 'Book checked out successfully'
    });
});

const getAllCheckedOutBooks = catchAsync(async (req, res, next) => {
    // Find all books that are checked out
    const checkedOutBooks = await Book.findAll({
        where: {
            checkedOutByUserId: {
                [Op.not]: null // Not null means the book is checked out
            }
        }
    });

    if (!checkedOutBooks.length) {
        return next(new AppError('No books are currently checked out', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { checkedOutBooks }
    });
});

const getCheckedOutBooksByUser = catchAsync(async (req, res, next) => {
    const userId = req.user.id; // Assuming the user ID is stored in the request object

    // Find all books that are checked out by the current user
    const checkedOutBooks = await Book.findAll({
        where: {
            checkedOutByUserId: userId // Filter by the current user's ID
        }
    });

    if (!checkedOutBooks.length) {
        return next(new AppError('You have not checked out any books', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { checkedOutBooks }
    });
});



const getBooksSortedByRating = catchAsync(async (req, res, next) => {
    // Default to 'desc' if not specified by the user
    const sortOrder = req.query.sortOrder && req.query.sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const books = await Book.findAll({
        attributes: {
            include: [
                // Include the average rating
                [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('Reviews.rating')), 0), 'avgRating'] // Treat null as zero
            ]
        },
        include: [{
            model: Review,
            attributes: []
        }],
        group: ['Book.id'],
        order: [
            [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('Reviews.rating')), 0), sortOrder] // Use user-specified sort order
        ],
        raw: true, // Make sure to add raw: true if you want to directly use the dataValues
    });

    if (!books.length) {
        return next(new AppError('No books found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { books }
    });
});



const filterBooksByRating = catchAsync(async (req, res, next) => {
    const minRating = parseFloat(req.query.minRating) || 0;
    const maxRating = parseFloat(req.query.maxRating) || 5;

    const books = await Book.findAll({
        attributes: {
            include: [
                [sequelize.fn('AVG', sequelize.col('Reviews.rating')), 'avgRating']
            ]
        },
        include: [{
            model: Review,
            attributes: []
        }],
        group: ['Book.id'],
        having: sequelize.where(sequelize.fn('AVG', sequelize.col('Reviews.rating')), '>=', minRating),
        order: [
            ['title', 'ASC']
        ],
        raw: true,
    });

    if (!books.length) {
        return next(new AppError('No books found matching the specified criteria', 404));
    }

    const filteredBooks = books.filter(book => {
        return parseFloat(book.avgRating) <= maxRating;
    });

    if (!filteredBooks.length) {
        return next(new AppError('No books found matching the specified criteria', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { books: filteredBooks }
    });
});

const filterBooksByAvailability = catchAsync(async (req, res, next) => {
    const { available } = req.query;

    if (available !== 'true' && available !== 'false') {
        return next(new AppError('Invalid value for availability parameter. Use "true" or "false"', 400));
    }

    const books = await Book.findAll({
        where: { available: available === 'true' },
    });

    if (!books.length) {
        return next(new AppError(`No ${available === 'true' ? 'available' : 'unavailable'} books found`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: { books }
    });
});

const getFeaturedBooks = catchAsync(async (req, res, next) => {
    const books = await Book.findAll({
        attributes: ['id', 'title', 'author', 'description', 'coverImage'],
        include: [{
            model: Review,
            attributes: [
                [sequelize.literal('COALESCE("Reviews"."id", 0)'), 'reviewId'], // Use COALESCE to handle NULL values
                [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
            ]
        }],
        group: ['Book.id', 'Reviews.id'], // Include 'Reviews.id' in the GROUP BY clause
        order: sequelize.literal('RANDOM()'), // Order randomly
    });

    if (!books.length) {
        return next(new AppError('No books found', 404));
    }

    // Prepare the response data
    const featuredBooks = books.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        coverImage: book.coverImage,
        avgRating:  book.Reviews[0] ? parseFloat(book.Reviews[0].dataValues.avgRating || 0) : 0
        // avgRating: parseFloat(book.Reviews[0].dataValues.avgRating || 0)
    }));

    res.status(200).json({
        status: 'success',
        data: { books: featuredBooks }
    });
});





module.exports ={addBook, upload, getBookById, getAllBooks, searchBooks, editBook, deleteBook, checkOutBook, getAllCheckedOutBooks, getCheckedOutBooksByUser, getBooksSortedByRating, filterBooksByRating, filterBooksByAvailability, getFeaturedBooks}