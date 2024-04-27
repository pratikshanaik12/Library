import React, { useEffect } from 'react';
import LogoutButton from '../components/LogoutButton';
import CustomerHomepage from '../components/CustomerHomepage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookProvider } from '../context/BookContext';

const CustomerHomePage: React.FC = () => {
    const navigate = useNavigate();
  const { user, loggedIn } = useAuth();

  useEffect(() => {
    setTimeout(()=>{
      setTimeout(abc, 250);
      function abc(){

        if (!loggedIn || !user || user.role !== 'customer') {
          navigate('/login');
      }

      }
    })
  }, [user, loggedIn]);
    return (
        <div>
          <BookProvider>
          <CustomerHomepage/>
            <LogoutButton/>
          </BookProvider>
            
        </div>
    );
};

export default CustomerHomePage;


