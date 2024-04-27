import React, { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { useBook } from "../context/BookContext";

const FilterBooksByRating: React.FC = () => {
  const { fetchBooksByRating, fetchFeaturedBooks, sortOrder } = useBook(); 

  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(5);

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setMinRating(value);
  };

  const handleFilter = () => {
    fetchBooksByRating(minRating, maxRating);
  };

  const handleClear = () => {
    setMinRating(0);
    setMaxRating(5);
    fetchFeaturedBooks(sortOrder);
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h3>Filter Books by Rating</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <Form.Group controlId="ratingRange">
            <Form.Label>Rating Range</Form.Label>
            <Form.Control
              type="range"
              min={0}
              max={5}
              step={1}
              value={minRating}
              onChange={handleRatingChange}
            />
            <p>
              Min: {minRating.toFixed(0)} - Max: {maxRating.toFixed(0)}
            </p>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <Button variant="primary" onClick={handleFilter}>
            Filter Books
          </Button>

          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default FilterBooksByRating;
