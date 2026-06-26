const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

//Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public

const register = async (req, res) => {
    try {
        // Get data from request body
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'})
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to database
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })

        // Send token + user info back
        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public

const login = async (req, res) => {
    try {
        // Get email and password from body
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        // Send response with token
        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private

const getMe = async (req, res) => {
    try {
        // req.user is already set by auth middleware
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { register, login, getMe }