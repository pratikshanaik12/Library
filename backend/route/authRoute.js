const { signup, login, protect, logout, checkLoggedInStatus } = require('../controller/authController');

const router = require('express').Router();

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').post(logout)

// Current User Endpoint
router.get('/current-user', protect, (req, res) => {
    // After passing through 'protect', 'req.user' will contain the user details
    console.log(req.user)
    if (!req.user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        });
    }

    // Exclude sensitive information
    const { password, ...userData } = req.user.toJSON();

    res.status(200).json({
        status: 'success',
        data: {
            user: userData
        }
    });
});

module.exports = router