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
    secret: 'secret-key',  // Gantilah ini dengan kunci rahasia yang lebih kuat untuk produksi
    resave: false,
    saveUninitialized: false, // Ubah menjadi false untuk mencegah penyimpanan sesi yang tidak dimodifikasi
    cookie: {
        secure: false, // Ubah menjadi true jika menggunakan HTTPS
        maxAge: 60000 // Set waktu kedaluwarsa cookie (contoh: 1 menit)
    }
}));

// Debugging middleware
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    console.log('Session:', req.session); // Log session untuk debugging
    next();
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt with username: ${username}`);
    userRepository.findByUsername(username, (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (!user) {
            console.error('User not found');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                console.log('Password match');
                req.session.admin = true; // Set session admin
                console.log('Session set:', req.session); // Log session for debugging
                return res.json({ message: 'Login successful' });
            } else {
                console.error('Password mismatch');
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    });
});

app.get('/admin', (req, res) => {
    if (req.session.admin) {
        console.log('Accessing admin page with session:', req.session); // Log session
        res.sendFile(path.join(__dirname, '../presentation/admin.html')); // Arahkan ke admin.html
    } else {
        console.log('Unauthorized access attempt to admin page'); // Log unauthorized access
        res.status(401).send('Unauthorized');
    }
});

// Endpoint lainnya
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

// Rute untuk halaman web
app.get('/admin', (req, res) => {
    if (req.session.admin) {
        console.log('Accessing admin page with session:', req.session); // Log session
        res.sendFile(path.join(__dirname, '../presentation/admin.html')); // Arahan ke file admin.html
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../presentation/index.html'));
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
