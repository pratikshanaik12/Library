import React, { useEffect } from 'react';
import { useBook } from '../context/BookContext'; 
import { useParams } from 'react-router-dom';

const BookDetails: React.FC = () => {
  const {book, editBook, } = useBook();

  console.log("this is book detail", editBook)

 const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  if (!book) return <p>No book details available.</p>;

  return (
    <div>
      <h2>{book?.title}</h2>
      <div>
      <p>Author: {book?.author}</p>
      <p>Description: {book?.description}</p>
      <p>Publisher: {book?.publisher}</p>
      <p>Publication Date: {book?.publicationDate instanceof Date ? formatDate(book?.publicationDate) : book?.publicationDate}</p>
      <p>Category: {book?.category}</p>
      <p>ISBN: {book?.isbn}</p>
      <p>Page Count: {book?.pageCount}</p>
      <p>Available: {book?.available ? 'Yes' : 'No'}</p>

      <>
            <p>Reviews:</p>
            <ul>
              {book?.Reviews?.map((review) => (
                <li key={review.id}>
                  <p>Rating: {review.rating}</p>
                  <p>Comment: {review.comment}</p>
                  {review.User && (
                    <p>By: {review.User.firstname} {review.User.lastname}</p>
                  )}
                </li>
              ))}
            </ul>
          </>



      

      </div>
      
      {/* Add more book details as needed */}
    </div>
  );
};

export default BookDetails;
