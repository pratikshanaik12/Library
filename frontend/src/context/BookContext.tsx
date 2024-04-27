import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import api from '../utils/api';

interface Book {
  id?: number;
  title?: string;
  author?: string;
  description?: string;
  publisher?: string;
  publicationDate?: Date | string;
  category?: string;
  isbn?: string;
  pageCount?: number;
  available?: boolean;
  checkOutDate?: Date | null;
  coverImage?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
  avgRating?: number | null;
  Reviews?: Review[]; 
}

interface SingleBook {
  id?: number;
  title?: string;
  author?: string;
  description?: string;
  publisher?: string;
  publicationDate?: Date | string;
  category?: string;
  isbn?: string;
  pageCount?: number;
  available?: boolean;
  checkOutDate?: Date | null;
  coverImage?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
  avgRating?: number | null;
  Reviews?: Review[];
}

interface Review {
  id?: number;
  rating?: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
  bookId?: number;
  userId?: number;
  User?: User; 
}

interface User {
  id?: number;
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}




  interface NewlyAddedBook extends Book {
    title?: string;
    author?: string;
    description?: string;
    publisher?: string;
    publicationDate?: Date| string ;
    category?: string;
    isbn?: string;
    pageCount?: number;
    coverImage?: string;
  }

type FetchFeaturedBooks = (sortOrder: string) => Promise<void>;
type FetchBooksByRating = (minRating: number, maxRating: number) => Promise<void>;
type FetchBookDetails = (bookId: number) => Promise<void>;
type FilterBooksByAvailability = (available: boolean) => Promise<void>;



interface BookContextType {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  fetchFeaturedBooks: FetchFeaturedBooks;
  sortOrder: string; 
  setSortOrder: React.Dispatch<React.SetStateAction<string>>; 
  deleteBook: (bookId: number) => Promise<void>;
  handleDelete: (bookId: number) => Promise<void>;
  confirmDelete: () => Promise<void>;
  showConfirmation: boolean;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  bookToDelete: number | null;
  setBookToDelete: React.Dispatch<React.SetStateAction<number | null>>;
  handleDeleteClick: (bookId: number | undefined) => void;

  book: Book;
  file: File | null;
  setBook: React.Dispatch<React.SetStateAction<SingleBook>>; 
  setFile: React.Dispatch<React.SetStateAction<File | null>>; 
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  showAddBookModal: boolean;
  setShowAddBookModal: React.Dispatch<React.SetStateAction<boolean>>;
  newlyAddedBook: NewlyAddedBook | null;
  setNewlyAddedBook: React.Dispatch<React.SetStateAction<NewlyAddedBook | null>>;

  bookId: number | null;
  editBook: Book | null;
  setBookId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditBook: React.Dispatch<React.SetStateAction<Book | null>>;
  showEditModal: boolean;
  setShowEditModal: React.Dispatch <React.SetStateAction<boolean>>;
  editFile: File | null;
  setEditFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleEditFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  fetchBookDetails: FetchBookDetails;
  fetchBooksByRating: FetchBooksByRating;
  filterBooksByAvailability: FilterBooksByAvailability;
  
}

interface BookProviderProps {
    children: ReactNode;
  }

  const BookContext = createContext<BookContextType | undefined>(undefined);

  export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {

  const [books, setBooks] = useState<Book[]>([]);
  const [sortOrder, setSortOrder] = useState('RAT');

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [bookId, setBookId] = useState<number | null>(null);


  const [editBook, setEditBook] = useState<Book | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editFile, setEditFile] = useState<File | null>(null);


  const [book, setBook] = useState<SingleBook>({});

const [file, setFile] = useState<File | null>(null); 

const [showAddBookModal, setShowAddBookModal] = useState<boolean>(false);
const [newlyAddedBook, setNewlyAddedBook] = useState<NewlyAddedBook | null>(null);
    const fetchFeaturedBooks: FetchFeaturedBooks = async (srt: string) => {
      try {
        let url = ''
        if(['ASC', 'DESC'].includes(srt)){
          setSortOrder(srt)
          url = `common/books-sorted-by-rating?sortOrder=${srt}`
        }else{
          setSortOrder('RAT')
          url = 'common/featured-books'
        }
        console.log("url", url, sortOrder, srt)
        const response = await api.get(url);

      let transformedBooks = [];

        if (response.data.data.books) {
          transformedBooks = response.data.data.books.map((book: any) => ({
            ...book,
            avgRating: book.avgRating !== null ? parseInt(book.avgRating) : 0
          }));
        }

        setBooks(transformedBooks);
      } catch (error) {
        console.error('Error fetching featured books:', error);
      }
    };

  const deleteBook = async (bookId: number) => {
    try {
      await api.delete(`librarian/delete-book/${bookId}`);
      await fetchFeaturedBooks(sortOrder);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };


  const handleDelete = async (bookId: number) => {
    setBookToDelete(bookId);
    setShowConfirmation(true);
  };

  const handleDeleteClick = (bookId: number | undefined) => {
    if (bookId !== undefined) {
      handleDelete(bookId);
    }
  };

  const confirmDelete = async () => {
    if (bookToDelete !== null) {
      try {
        await api.delete(`librarian/delete-book/${bookToDelete}`);
        await fetchFeaturedBooks(sortOrder);  
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
    setShowConfirmation(false);
    setBookToDelete(null);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(e.target)
    setBook(prevBook => ({
        ...prevBook,
        [name]: name === 'publicationDate' ? new Date(value) : value,
    }));
};


const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
        setFile(files[0])
        console.log("file selected", files[0])
    }
};


const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const formData = new FormData();
    Object.entries(book).forEach(([key, value]) => {
        formData.append(key, value.toString());
    });

  if (file) {
    formData.append("coverImage", file);
    console.log("File added to form data:", file);
  }
  
  try {
    
    const response = await api.post(
        
      'librarian/add-book',
      formData,
      
      { 
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    handleBookAdded(response.data.data.book)
    setBook({});
    fetchFeaturedBooks(sortOrder)
    setShowAddBookModal(false)
  } catch (error) {
    console.error("Failed to update book:", error);
  }
}



  const handleAddBook = () => {
    setShowAddBookModal(true);
  };

  const handleBookAdded = (newBook: NewlyAddedBook) => {
    setNewlyAddedBook(newBook);
    setShowAddBookModal(false);
  };


const fetchBookDetails: FetchBookDetails = async (bookId: number) => {
  
  try {
    const response = await api.get(`common/books/${bookId}`);
    setEditBook(response.data.data.book);
    setShowEditModal(true);
    return response.data.data.book
  } catch (error) {
    console.error("Error fetching book details:", error);
  }
};

const fetchBooksByRating: FetchBooksByRating = async (minRating: number, maxRating: number) => {
  try {
    const response = await api.get(`common/books-filter-by-rating?minRating=${minRating}&maxRating=${maxRating}`);
    setBooks(response.data.data.books); 
  } catch (error) {
    console.error('Error fetching books by rating:', error);
  }
};

const filterBooksByAvailability: FilterBooksByAvailability = async (available: boolean) => {
  try {
    const response = await api.get(`common/books-filter-by-availability?available=${available}`);
    setBooks(response.data.data.books); 
  } catch (error) {
    console.error('Error filtering books by availability:', error);
  }
};



const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  console.log(e.target.value)
  setEditBook(prev => ({
    ...prev,
    [name]: name === 'publicationDate' ? new Date(value) : value,
  }));
};


const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files && files[0]) {
    setEditFile(files[0]);
  }
};


const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!editBook) return;
  const formData = new FormData();
  Object.entries(editBook).forEach(([key, value]) => {
    if (value !== undefined&& value !== null) {
      formData.append(key, value.toString());
    }
  });


  if (!editFile && editBook && editBook.coverImage) {
    formData.append("coverImage", editBook.coverImage); 
  } else if (editFile) {
    formData.append("coverImage", editFile);
  }

  try {
    const response = await api.put(`librarian/edit-book/${editBook.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setBooks(prev => [...prev.filter(book => book.id !== editBook.id), response.data.data.book]);
    setShowEditModal(false);
    setEditBook(null);
    setEditFile(null);
  } catch (error) {
    console.error("Failed to update book:", error);
  }
};
    
    return (
      <BookContext.Provider value={{
        books, setBooks, fetchFeaturedBooks,
        sortOrder, setSortOrder,
        deleteBook, confirmDelete, handleDelete, handleDeleteClick,
        showConfirmation, setShowConfirmation,
        bookToDelete, setBookToDelete,
        book, setBook,
        file, setFile,
        handleChange, handleFileChange, handleSubmit,
        showAddBookModal,
        setShowAddBookModal,
        newlyAddedBook,
        setNewlyAddedBook,
        editBook, setEditBook, setBookId,
        showEditModal, setShowEditModal,
        editFile, setEditFile,
        handleEditChange, handleEditSubmit, handleEditFileChange, fetchBookDetails, bookId, fetchBooksByRating, filterBooksByAvailability,
      }}>
        {children}
      </BookContext.Provider>
    );
  
  }

  export const useBook = () => {
    const context = useContext(BookContext);
    if (context === undefined) {
      throw new Error('useBook must be used within an BookProvider');
    }
    return context;
  };