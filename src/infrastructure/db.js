const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, '../../data/database.sqlite');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS products`, (err) => {
        if (err) {
            console.error('Error dropping table:', err.message);
        } else {
            console.log('Dropped existing products table.');
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        category TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Created products table.');
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS admins (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Created admins table.');
        }
    });

    // Insert initial products
    const initialProducts = [
        { id: '1', name: 'Coffee', price: 10000, category: 'coffee' },
        { id: '2', name: 'Tea', price: 8000, category: 'non-coffee' },
        { id: '3', name: 'Pop-Ice', price: 15000, category: 'non-coffee' },
        { id: '4', name: 'Sandwich', price: 15000, category: 'food' }
    ];

    initialProducts.forEach(product => {
        db.run(`INSERT OR IGNORE INTO products (id, name, price, category) VALUES (?, ?, ?, ?)`,
               [product.id, product.name, product.price, product.category],
               (err) => {
            if (err) {
                console.error('Error inserting initial product:', err.message);
            }
        });
    });

    // Insert initial admin
    const saltRounds = 10;
    const defaultAdmin = { username: 'admin', password: 'password' };

    bcrypt.hash(defaultAdmin.password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
        } else {
            db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)`,
                   [defaultAdmin.username, hashedPassword],
                   (err) => {
                if (err) {
                    console.error('Error inserting initial admin:', err.message);
                }
            });
        }
    });
});

module.exports = db;
