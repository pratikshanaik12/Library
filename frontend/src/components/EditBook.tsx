import React from "react";
import { Button, Modal, Form, } from "react-bootstrap";
import { useBook } from "../context/BookContext";

interface EditBookProps {
  book: any; 
}

const EditBook : React.FC<EditBookProps> =({book})=>{
  const{ 
    showEditModal, setShowEditModal, editBook, handleEditChange, handleFileChange, handleEditSubmit, fetchBookDetails, setBookId,
  } = useBook();
  

  const handleEditBookClick = async () => {
    if (book.id !== null) {
      // Fetch book details if bookId is not null
      await fetchBookDetails(book.id);
      setShowEditModal(true);
    } else {
      console.error("bookId is null. Cannot fetch book details.");
    }
  };
  return(
    <>
    <Button variant="primary" onClick={handleEditBookClick} >
        Edit Book
    </Button>

    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            {/* Form fields */}
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={editBook?.title} onChange={handleEditChange} required />
            </Form.Group>
            <Form.Group controlId="author">
                        <Form.Label>Author</Form.Label>
                        <Form.Control type="text" name="author" value={editBook?.author} onChange={handleEditChange} required />
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" value={editBook?.description} onChange={handleEditChange} required />
                    </Form.Group>
                    <Form.Group controlId="isbn">
                        <Form.Label>ISBN</Form.Label>
                        <Form.Control type="text" name="isbn" value={editBook?.isbn} onChange={handleEditChange} required />
                    </Form.Group>
                    <Form.Group controlId="publisher">
                        <Form.Label>Publisher</Form.Label>
                        <Form.Control type="text" name="publisher" value={editBook?.publisher} onChange={handleEditChange} required />
                    </Form.Group>
                    <Form.Group controlId="publicationDate">
                        <Form.Label>Publication Date</Form.Label>
                        <Form.Control type="date" name="publicationDate" value={editBook?.publicationDate instanceof Date ? editBook.publicationDate.toISOString().split('T')[0] : 
                        // editBook?.publicationDate
                        ""
                        }  onChange={handleEditChange} required />
                    </Form.Group>
                    <Form.Group controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control type="text" name="category" value={editBook?.category} onChange={handleEditChange} required />
                    </Form.Group>
                    <Form.Group controlId="pageCount">
                        <Form.Label>Page Count</Form.Label>
                        <Form.Control type="number" name="pageCount" value={editBook?.pageCount} onChange={handleEditChange} required />
                    </Form.Group>
            <Form.Group controlId="coverImage">
              <Form.Label>Cover Image</Form.Label>
              <Form.Control type="file" name="coverImage" onChange={handleFileChange} />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
              <Button variant="primary" type="submit">Edit Book</Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default EditBook;