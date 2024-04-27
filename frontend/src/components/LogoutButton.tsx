import React from 'react';
import { Button } from 'react-bootstrap';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';

const LogoutButton: React.FC = () => {
    const {setLoggedIn} = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const token = Cookies.get('token')
            console.log(token)
            await axios.post('auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLoggedIn(false)
            Cookies.remove('token')
            navigate('/')
        } catch (error: any) {
            console.error(error.response.data);
            
        }
    };

    return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
