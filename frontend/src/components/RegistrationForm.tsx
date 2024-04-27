import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstname: string;
    lastname: string;
    role: string;
}

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstname: '',
        lastname: '',
        role: ''
    });

    const [error, setError] = useState<string | null>(null); // State to store error message

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null); // Clear error message when user starts typing again
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('auth/signup', formData);
            console.log(response.data);
            navigate('/login')

        } catch (error: any) {
            setError(error.response?.data?.message || "An error occurred. Please try again.");
            console.error(error.response?.data);
        }
    };

    return (
        <>
        {error && ( 
                <Alert variant="danger">{error}</Alert>
        )}
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                />
            </Form.Group>

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
            <Form.Group controlId="firstname">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="Enter first name"
                />
            </Form.Group>

            <Form.Group controlId="lastname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Enter last name"
                />
            </Form.Group>

            <Form.Group controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Control
                    as="select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="">Select role</option>
                    <option value="librarian">Librarian</option>
                    <option value="customer">Customer</option>
                </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">Sign Up</Button>
        </Form>
        <Link to="/login">Already have an account? Login here</Link>
        </>
    );
};

export default RegistrationForm;
