// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
// import { Container } from 'react-bootstrap';
// import NavBar from './components/Navbar';
// import RegistrationPage from './pages/RegistrationPage';
// import LoginPage from './pages/LoginPage';
// import HomePage from './pages/LibrarianHomePage';
// import LogoutButton from './components/LogoutButton';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import CustomerHomePage from './pages/CustomerHomePage';
// import LibrarianHomePage from './pages/LibrarianHomePage';

// const App: React.FC = () => {
//     const navigate = useNavigate()
//     const {user} = useAuth();
//     useEffect(() => {
//         if (user) {
//             // Assuming 'role' is part of user data
//             switch (user.role) {
//                 case 'customer':
//                     navigate('/customer-homepage');
//                     break;
//                 case 'librarian':
//                     navigate('/librarian-homepage');
//                     break;
//                 default:
//                     // Redirect to a default page or error page
//                     navigate('/login');
//             }
//         }
//     }, [user,navigate]);
//     return (
//         <Router>
//             <AuthProvider>
//                 <Container>
//                     <Routes>
//                         <Route path="/signup" element={<RegistrationPage />} />
//                         <Route path="/login" element={<LoginPage />} />
//                         <Route path="/" element={<LoginPage />} /> 
//                         <Route path='/homepage' element={<HomePage/>}/>
//                         <Route path='/logout' element={<LogoutButton/>}/>
//                         <Route path="/customer-homepage" element={<CustomerHomePage />} />
//                         <Route path="/librarian-homepage" element={<LibrarianHomePage />} />
//                     </Routes>
                    
//                     {/* <p>
//                         {window.location.pathname === '/signup' ? (
//                             <Link to="/login">Already have an account? Login here</Link>
//                         ) : (
//                             <Link to="/signup">Don't have an account? Sign up here</Link>
//                         )}
//                     </p> */}
//                 </Container>
//             </AuthProvider>
//         </Router>
//     );
// };

// export default App;
// function useEffect(arg0: () => void, arg1: any[]) {
//     throw new Error('Function not implemented.');
// }


// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import CustomerHomePage from './pages/CustomerHomePage';
import LibrarianHomePage from './pages/LibrarianHomePage';
import LogoutButton from './components/LogoutButton';
import { AuthProvider } from './context/AuthContext';
import BookDetails from './components/BookDetails';
import { BookProvider } from './context/BookContext';
import BookDetailsPage from './components/BookDetailsPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
    <BookProvider>    
      <Router>
        <Container>
          <Routes>
            <Route path="/signup" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path='/logout' element={<LogoutButton />} />
            <Route path="/customer-homepage" element={<CustomerHomePage />} />
            <Route path="/librarian-homepage" element={<LibrarianHomePage />} />
            <Route path="/book/:id" element={<BookDetailsPage/>} />            
          </Routes>
        </Container>
      </Router>
      </BookProvider>
    </AuthProvider>
  );
};

export default App;

