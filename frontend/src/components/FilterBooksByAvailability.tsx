import React, { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useBook } from "../context/BookContext";

const FilterBooksByAvailability: React.FC = () => {
  const { filterBooksByAvailability, fetchFeaturedBooks, sortOrder } = useBook();
  const [filterValue, setFilterValue] = useState<boolean | null>(null);

  const handleFilter = async (availability: boolean | null) => {
    try {
      if (availability === null) {
        await fetchFeaturedBooks(sortOrder);
      } else {
        await filterBooksByAvailability(availability);
      }
    } catch (error) {
      console.error('Error filtering books by availability:', error);
    }
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h3>Filter Books by Availability</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <Button
            variant="primary"
            onClick={() => {
              setFilterValue(true); 
              handleFilter(true);
            }}
          >
            Show Available Books
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setFilterValue(false); 
              handleFilter(false);
            }}
          >
            Show Unavailable Books
          </Button>

          <Button
            variant="info"
            onClick={() => {
              setFilterValue(null); 
              handleFilter(null);
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default FilterBooksByAvailability;
