const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Registration route
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.render('register', { error: 'All fields are required' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.render('register', { error: 'Invalid email format' });
    }

    if (password.length < 6) {
        return res.render('register', { error: 'Password must be at least 6 characters' });
    }

    let user = await User.findOne({ email });
    if (user) return res.render('register', { error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    res.redirect('/');
});

// Login route
router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { error: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.render('login', { error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render('login', { error: 'Invalid credentials' });

    res.cookie('user', user._id, { httpOnly: true });
    res.redirect('/dashboard');
});

// Dashboard route
router.get('/dashboard', async (req, res) => {
    const userId = req.cookies.user;
    if (!userId) return res.redirect('/');

    const user = await User.findById(userId);
    if (!user) return res.redirect('/');

    res.render('dashboard', { user });
});

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
});

module.exports = router;
