import React from "react";
import { useBook } from "../context/BookContext";
import { Button, Modal, Form, } from "react-bootstrap";


const AddBook : React.FC =()=>{
    const{ 
        setShowAddBookModal,
        handleSubmit,
        handleChange,
        book,
        handleFileChange,
        showAddBookModal } = useBook();
    return(
<>
<Button variant="primary" onClick={() => setShowAddBookModal(true)}>
        Add Book
      </Button>

<Modal show={showAddBookModal} onHide={() => setShowAddBookModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Form fields */}
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={book.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="author">
                        <Form.Label>Author</Form.Label>
                        <Form.Control type="text" name="author" value={book.author} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" value={book.description} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="isbn">
                        <Form.Label>ISBN</Form.Label>
                        <Form.Control type="text" name="isbn" value={book.isbn} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="publisher">
                        <Form.Label>Publisher</Form.Label>
                        <Form.Control type="text" name="publisher" value={book.publisher} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="publicationDate">
                        <Form.Label>Publication Date</Form.Label>
                        <Form.Control type="date" name="publicationDate" value={book.publicationDate instanceof Date ? book.publicationDate.toISOString().split('T')[0] : book.publicationDate}  onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control type="text" name="category" value={book.category} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="pageCount">
                        <Form.Label>Page Count</Form.Label>
                        <Form.Control type="number" name="pageCount" value={book.pageCount} onChange={handleChange} required />
                    </Form.Group>
            <Form.Group controlId="coverImage">
              <Form.Label>Cover Image</Form.Label>
              <Form.Control type="file" name="coverImage" onChange={handleFileChange} />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddBookModal(false)}>Close</Button>
              <Button variant="primary" type="submit">Add Book</Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
</>
    
    )

}

export default AddBook