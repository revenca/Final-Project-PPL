// my-project/infrastructure/db.js

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
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS admins (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL
    )`);

    // Insert initial products
    const initialProducts = [
        { id: '1', name: 'Coffee', price: 10000 },
        { id: '2', name: 'Tea', price: 8000 },
        { id: '3', name: 'Sandwich', price: 15000 }
    ];

    initialProducts.forEach(product => {
        db.run(`INSERT OR IGNORE INTO products (id, name, price) VALUES (?, ?, ?)`,
               [product.id, product.name, product.price],
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

