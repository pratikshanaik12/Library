import React, { useEffect } from 'react';
import BookDetails from './BookDetails'; 
import { useBook } from '../context/BookContext';
import { Link } from 'react-router-dom';

const BookDetailsPage: React.FC = () => {
  const { book} = useBook();

  return (
    <div>
      {book ? (
        <div>
          <h2>Book Details</h2>
          <BookDetails />
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Link to="/customer-homepage">Back to Homepage</Link>
    </div>
  );
};

export default BookDetailsPage;
