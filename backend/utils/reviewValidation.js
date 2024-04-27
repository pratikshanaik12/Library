// Function to validate review data
function validateReview(data) {
    const errors = [];

    // Check if userId is provided and is a valid integer
    if (!data.hasOwnProperty('userId') || !Number.isInteger(data.userId)) {
        errors.push('userId must be a valid integer');
    }

    // Check if bookId is provided and is a valid integer
    if (!data.hasOwnProperty('bookId') || !Number.isInteger(data.bookId)) {
        errors.push('bookId must be a valid integer');
    }

    // Check if rating is provided and is an integer between 1 and 5
    if (!data.hasOwnProperty('rating') || !Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
        errors.push('rating must be an integer between 1 and 5');
    }

    // Check if comment is provided and is a string with maximum length of 1000 characters
    if (data.hasOwnProperty('comment') && typeof data.comment !== 'string') {
        errors.push('comment must be a string');
    } else if (data.comment && data.comment.length > 1000) {
        errors.push('comment must be less than 1000 characters');
    }

    // Return errors if any, otherwise return null
    return errors.length === 0 ? null : errors;
}



module.exports = {
    validateReview
};
