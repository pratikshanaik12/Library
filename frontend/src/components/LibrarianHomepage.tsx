import React, { useEffect, useState } from "react";
import { Button, Container, Card, Row, Col, Modal, Form } from "react-bootstrap";
import Search from "./SearchBooks";
import SortBooks from "./SortBooks";
import AddBook from "./AddBook";
import EditBook from "./EditBook";
import { useBook, BookProvider } from "../context/BookContext";
import FilterBooksByRating from "./FilterBookByRating";
import FilterBooksByAvailability from "./FilterBooksByAvailability";


interface Book{ 
  id?: number;
  title?: string;
  author?: string;
  description?: string;
  publisher?: string;
  publicationDate?: Date| string;
  category?: string;
  isbn?: string;
  pageCount?: number;
  available?: boolean;
  checkOutDate?: Date | null;
  coverImage?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
  avgRating?:number | null;
}



const LibrarianHomepage: React.FC = () => {
  const {
    books,
    setBooks,
    fetchFeaturedBooks,
    sortOrder,
    handleDelete,
    showConfirmation,
    setShowConfirmation,
    confirmDelete,
    handleDeleteClick,
    book, 
    setBook,
    file,
    setFile,handleChange, handleFileChange, handleSubmit, showAddBookModal, setShowAddBookModal,


    
  } = useBook();


  

  const handleAddBook = () => {
    setShowAddBookModal(true);
  };

  const handleBookUpdated = (updatedBook: Book) => {
    const updatedBooks = books.map((book) =>
      book.id === updatedBook.id ? updatedBook : book
    );
    setBooks(updatedBooks);
  };

  useEffect(() => {
    fetchFeaturedBooks(sortOrder);
  }, []);

  return (
    <Container className="mt-5">
      <h1>Welcome, Librarian!</h1>
      <p>
        This is your dashboard where you can manage books, view user activities,
        and handle other administrative tasks.
      </p>

      <AddBook/>

      <Search />
      <SortBooks />
      <FilterBooksByRating/>
      <FilterBooksByAvailability/>



      <Container>
        <Row>
          {books.map((book) => (
            <Col key={book.id ? book.id : Math.random()} md={4}>
              <Card className="mb-4">
                <Card.Img variant="top" src={book.coverImage} />
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {book.author}
                  </Card.Subtitle>
                  <Card.Text>{book.description}</Card.Text>
                 <Card.Text>{book.avgRating !== null && book.avgRating !== undefined ? Math.round(book.avgRating) : 0}</Card.Text>

                  <Button variant="danger" onClick={() => handleDeleteClick(book.id)}>
                            Delete
                      </Button>
                  <EditBook key={book.id} book= {book}/>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Modal
                        show={showConfirmation}
                        onHide={() => setShowConfirmation(false)}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Confirm Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          Are you sure you want to delete this book?
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={() => setShowConfirmation(false)}
                          >
                            Cancel
                          </Button>
                          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
                          
                        </Modal.Footer>
                      </Modal>
    </Container>
  );
};

export default LibrarianHomepage;

