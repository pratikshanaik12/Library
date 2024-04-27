function validateBook(book) {
    const errors = [];

    if(!book.title){
        errors.push('Title is required')
    }
    if(typeof book.title !== 'string'){
        errors.push('Book must be a string')
    }
    if(book.title.trim().length === 0){
        errors.push("Book can't be a non-empty string.")
    }
    if(book.title.trim() !== book.title){
        errors.push('Has leading or trailing space.')
    }

    const titleRegex = /^(?!\s)(?!.*\s{2})[\w\d\s.,'"()-]{1,100}(?<!\s)$/;
    if (!titleRegex.test(book.title)) {
        errors.push('Invalid title format.');
    }
    if (!book.description) {
        errors.push('Description is required.');
    }

    // Type check
    if (typeof book.description !== 'string') {
        errors.push('Description must be a string.');
    }

    // Length check
    if (book.description.length < 1 || book.description.length > 1000) {
        errors.push('Description must be between 1 and 1000 characters long.');
    }

    // Leading or trailing spaces check
    if (book.description.trim() !== book.description) {
        errors.push('Description cannot have leading or trailing spaces.');
    }

    // Presence check
    if (!book.isbn) {
        errors.push('ISBN is required.');
    }

    

    // Type check
    if (typeof book.isbn !== 'string') {
        errors.push('ISBN must be a string.');
    }

    // Length check
    if (book.isbn.length !== 10 && book.isbn.length !== 13) {
        errors.push('ISBN must be either 10 or 13 characters long.');
    }


    // Leading or trailing spaces check
    if (book.isbn.trim() !== book.isbn) {
        errors.push('ISBN cannot have leading or trailing spaces.');
    }

   

    
    const dateFormat = /^\d{2}-\d{2}-\d{4}$/;
      
    // Validate checkedOutByUserId
    if (book.checkedOutByUserId !== undefined && (typeof book.checkedOutByUserId !== 'number' || !Number.isInteger(book.checkedOutByUserId))) {
        errors.push('CheckedOutByUserId must be an integer.');
    }

    // Validate checkOutDate
    if (book.checkOutDate !== undefined && !(book.checkOutDate instanceof Date) && !dateFormat.test(book.checkOutDate)) {
        errors.push('CheckOutDate must be a valid Date object.');
    }

    return {errors: errors};
}

module.exports = {
    validateBook
};
