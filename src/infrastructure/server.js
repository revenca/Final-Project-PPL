const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const productRepository = require('../data/productRepository');
const userRepository = require('../data/userRepository');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../presentation')));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 60000
    }
}));

// Debugging middleware
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    console.log('Session:', req.session);
    next();
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    userRepository.findByUsername(username, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                req.session.admin = true;
                return res.json({ message: 'Login successful' });
            } else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

app.post('/api/products', (req, res) => {
    productRepository.add(req.body, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product added successfully' });
    });
});

app.get('/api/products', (req, res) => {
    productRepository.getAll((err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.delete('/api/products/:id', (req, res) => {
    productRepository.delete(req.params.id, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../presentation/index.html'));
});

app.get('/admin', (req, res) => {
    if (req.session.admin) {
        res.sendFile(path.join(__dirname, '../presentation/admin.html'));
    } else {
        res.status(401).sendFile(path.join(__dirname, '../presentation/admin-login.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
