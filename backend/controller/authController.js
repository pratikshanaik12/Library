const { User } = require("../db/models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const { validatePassword, validateUserInput } = require("../utils/userSignupValidation");

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '90d' });
}

const signup = catchAsync(async (req, res) => {
    const { role, username, email, password, firstname, lastname } = req.body;

    // Check if the role is valid
    if (!['librarian', 'customer'].includes(role)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid user type'
        });
    }

    // Validate user input
    const userInputValidation = validateUserInput(req.body);
    if (!userInputValidation.valid) {
        return res.status(400).json({
            status: 'fail',
            message: userInputValidation.message
        });
    }

    // Validate password complexity
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
        return res.status(400).json({
            status: 'fail',
            message: passwordCheck.message
        });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        firstname,
        lastname
    });

    // Respond with the newly created user (without sending hashed password)
    const result = { ...newUser.toJSON() };
    delete result.password;
    delete result.deletedAt;

    const token = generateToken({
        id: result.id
    });

    return res.status(201).json({
        status: 'success',
        data: { ...result, token }
    });
});


const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email and password'
        });
    }

    const user = await User.findOne({ where: { email } });
    console.log("This is : ", user)
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
            status: 'fail',
            message: 'Incorrect email or password',
        });
    }

    const token = generateToken({
        id: user.id,
    });

    // Set token in HTTP-only cookie
    res.cookie(user.email, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development', // set to true if using https
        maxAge: 90 * 24 * 60 * 60 * 1000 // cookie will expire in 90 days
    });

    
  

    return res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token: token
        }
    });
});


const logout = (req, res) => {
    // Clear the cookie
    res.clearCookie('jwt', {
        httpOnly: true,
        expires: new Date(0), // Set the cookie to expire immediately
        secure: false, // Should be true in production if using HTTPS
        sameSite: 'strict' // Helps prevent CSRF attacks
    });

    if (req.user) {
        console.log(`User ${req.user.id} logged out`);
    }
    res.status(200).json({
        status: 'success',
        message: 'Logout successful.'
    });
};


const protect = async (req, res, next) => {
    let token;
    if (req.cookies.email) {
        token = req.cookies.email;
    } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // If you still support bearer tokens, keep this branch
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'Not authorized, no token'
        });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findByPk(decoded.id);
        

        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user belonging to this token does no longer exist.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'fail',
            message: 'Not authorized to access this route'
        });
    }
};



const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ status: 'fail', message: 'You do not have permission to perform this action' });
        }
        next();
    };
};

module.exports = { signup, login, protect, restrictTo, logout };