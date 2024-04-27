import axios from '../utils/api';
import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  avgRating: number;
}

const SearchBooks: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`common/books/search?query=${searchQuery}`);
        if (!response || !response.data || !response.data.data || !response.data.data.books) {
          throw new Error('No books found matching the search query');
        }
        setSearchResults(response.data.data.books);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Container>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="form-control"
        />
      </div>
      <Row>
        {searchResults.map((book) => (

          <Col key={book.id} md={4}>
            <Card className="mb-4">
              <Card.Img variant="top" src={book.coverImage} />
              {/* <Card.Text>Hey</Card.Text> */}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{book.author}</Card.Subtitle>
                <Card.Text>{book.description}</Card.Text>
                <Card.Text>Average Rating: {book.avgRating}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SearchBooks;
