import React, { useEffect } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import SortBooks from "./SortBooks";
import { useBook } from '../context/BookContext';
import SearchBooks from './SearchBooks';
import FilterBooksByRating from './FilterBookByRating';
import FilterBooksByAvailability from './FilterBooksByAvailability';
import BookDetails from './BookDetails';
import { Link, useNavigate } from 'react-router-dom';


const CustomerHomepage: React.FC = () => {
  const navigate = useNavigate()
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
    setFile,handleChange, handleFileChange, handleSubmit, showAddBookModal, setShowAddBookModal, fetchBookDetails, bookId, 
    
  } = useBook();
  
  useEffect(() => {
    fetchFeaturedBooks(sortOrder);
  }, []);


  const handleBookClick = async (id: number | undefined) => {
    try {
      if (id !== undefined) {
        
        const fetchResult = await fetchBookDetails(id);
       
      if (fetchResult!== undefined) {
         console.log("this is fetch result: ", fetchResult)
        setBook(fetchResult);
        navigate(`/book/${id}`);

      } else {
        console.error("Failed to fetch book details");
      }
    } else {
      console.error("Invalid book id");
    }
    } catch (error) {
      console.error("Error handling book click:", error);
    }
  };
  
  

  return (

    
    <Container className="mt-5">
      
        <h1>Welcome, Customer!</h1>
      
        <SortBooks />
        <SearchBooks/>
        <FilterBooksByRating/>
        <FilterBooksByAvailability/>
        

        <Container>
        <Row>
          {books.map((book) => (
            <Col key={book.id ? book.id : Math.random()} md={4}>
              <Card className="mb-4" onClick={() => handleBookClick(book.id)}>
                <Link to = {`/book/${book.id}`}>
                <Card.Img variant="top" src={book.coverImage} />
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {book.author}
                  </Card.Subtitle>
                  <Card.Text>{book.description}</Card.Text>
                 <Card.Text>{book.avgRating}</Card.Text>
                </Card.Body>
                </Link>
               
              </Card>
            </Col>
          ))}
        </Row>
      </Container>    
    </Container>
  );
};

export default CustomerHomepage;
