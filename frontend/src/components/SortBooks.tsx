import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useBook } from "../context/BookContext";

const SortBooks : React.FC = () => {
  const{fetchFeaturedBooks} = useBook();
  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h3>Sort books by Rating:</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={4} className="mb-2">
          <Button onClick={() => fetchFeaturedBooks("ASC")}>
            Ascending
          </Button>
        </Col>
        <Col xs={12} sm={4} className="mb-2">
          <Button onClick={() => fetchFeaturedBooks("DESC")}>
            Descending
          </Button>
        </Col>
        <Col xs={12} sm={4}>
          <Button onClick={() => fetchFeaturedBooks("RAT")}>
            Clear
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SortBooks;
