const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ======================
// Register Page
// ======================
router.get('/register', (req, res) => {
    res.render('register');
});

// ======================
// Register Logic
// ======================
router.post('/register', async (req, res) => {

              const { name, email, phone, password } = req.body;

              let user = await User.findOne({ email });
    if (user) {
          return res.send("User already exists");
    }

              const hashedPassword = await bcrypt.hash(password, 10);

              user = new User({
                    name,
                    email,
                    password: hashedPassword
              });

              await user.save();

              res.redirect('/login');
});

// ======================
// Login Page
// ======================
router.get('/login', (req, res) => {
    res.render('login');
});

// ======================
// Login Logic
// ======================
router.post('/login', async (req, res) => {

              const { email, password } = req.body;

              const user = await User.findOne({ email });
    if (!user) {
          return res.send("Invalid credentials");
    }

              const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
          return res.send("Invalid credentials");
    }

              req.session.user = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
              };

              res.redirect('/dashboard');
});

// ======================
// Logout
// ======================
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
          res.redirect('/login');
    });
});

module.exports = router;
