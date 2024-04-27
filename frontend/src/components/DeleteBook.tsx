// DeleteBook.tsx
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import api from '../utils/api';
import { useBook } from '../context/BookContext';

interface DeleteBookProps {
  bookId: number;
}

const DeleteBook: React.FC<DeleteBookProps> = ({ bookId }) => {
  const {books, setBooks,fetchFeaturedBooks, sortOrder } = useBook();
  
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = async () => {
    setShowConfirmation(true)
    try {
      await api.delete(`librarian/delete-book/${bookId}`).then(async()=>{
        await fetchFeaturedBooks(sortOrder)
        setShowConfirmation(false);
      })  
    } catch (error) {
      console.error('Error deleting book:', error);
      setShowConfirmation(false)
    }
  };

  return (
    <>
      <Button variant="danger" onClick={() => setShowConfirmation(true)}>Delete</Button>
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteBook;
