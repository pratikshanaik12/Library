import React, { useEffect } from 'react';
import LogoutButton from '../components/LogoutButton';
import LibrarianHomepage from '../components/LibrarianHomepage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookProvider } from '../context/BookContext';


const LibrarianHomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, loggedIn } = useAuth();

  useEffect(() => {
    setTimeout(abc, 250);
    function abc() {
      if (!loggedIn || !user || user.role !=='librarian') {
        navigate('/login');
      }
    }
  }, [user, loggedIn]);
    return (
        <div>
          <BookProvider>
          <LibrarianHomepage/>
          <LogoutButton/>  

          </BookProvider>
          
        </div>
    );
};

export default LibrarianHomePage;
