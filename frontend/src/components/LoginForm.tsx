import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';

interface LoginForm {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: ''
    });
    const { setUser, setLoggedIn, loggedIn } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null); // State to store error message

    useEffect(() => {
        if (loggedIn) {
            navigate('/librarian-homepage');
        }
    }, [loggedIn, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null); // Clear error message when user starts typing again
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('auth/login', formData);
            const { role } = response.data.data.user;
            setUser(response.data.data.user);
            setLoggedIn(true);
            Cookies.set('jwt', response.data.data.token, { expires: 7 });

            if (role === 'customer') {
                navigate('/customer-homepage');
            } else if (role === 'librarian') {
                navigate('/librarian-homepage');
            }
        } catch (error: any) {
            // Handle error by setting the error state
            setError(error.response?.data?.message || "An error occurred. Please try again.");
            console.error(error.response.data);
        }
    };

    return (
        <>
            {error && ( // Conditionally render the error message
                <Alert variant="danger">{error}</Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
            <Link to="/signup">Don't have an account? Sign up here</Link>
        </>
    );
};

export default LoginForm;

