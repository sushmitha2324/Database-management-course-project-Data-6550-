require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const Item = require('./models/Item');
const User = require('./models/User');

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
          mongooseConnection: mongoose.connection,
          collection: 'sessions'
    })
}));

// Make user available in all views
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

// Routes
app.use('/', authRoutes);
app.use('/', itemRoutes);

app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

// Dashboard
app.get('/dashboard', async (req, res) => {

          if (!req.session.user) return res.redirect('/login');

          const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

          const searchQuery = req.query.search
      ? {
              user: req.session.user._id,
              itemName: { $regex: req.query.search, $options: 'i' }
      }
                : { user: req.session.user._id };

          const totalItems = await Item.countDocuments(searchQuery);

          const items = await Item.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

          const totalPages = Math.ceil(totalItems / limit);

          res.render('dashboard', {
                items,
                currentPage: page,
                totalPages,
                search: req.query.search || ''
          });
});

// Admin
app.get('/admin', async (req, res) => {

          if (!req.session.user) return res.redirect('/login');

          if (req.session.user.role !== 'admin') {
                return res.send("Access Denied");
          }

          const users = await User.find();
    const items = await Item.find().populate('user');

          res.render('admin', { users, items });
});

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
