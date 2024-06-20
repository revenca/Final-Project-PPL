const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

class Database {
    constructor() {
        if (!Database.instance) {
            this._dbPath = path.resolve(__dirname, '../../data/database.sqlite');
            console.log('Database path:', this._dbPath);

            this._db = new sqlite3.Database(this._dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err.message);
                } else {
                    console.log('Connected to the SQLite database.');
                }
            });

            this._initializeTables();

            Database.instance = this;
        }

        return Database.instance;
    }

    _initializeTables() {
        this._db.serialize(() => {
            this._db.run(`DROP TABLE IF EXISTS products`, (err) => {
                if (err) {
                    console.error('Error dropping table:', err.message);
                } else {
                    console.log('Dropped existing products table.');
                }
            });

            this._db.run(`CREATE TABLE IF NOT EXISTS products (
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

            this._db.run(`CREATE TABLE IF NOT EXISTS admins (
                username TEXT PRIMARY KEY,
                password TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                } else {
                    console.log('Created admins table.');
                }
            });

            this._db.run(`CREATE TABLE IF NOT EXISTS receipts (
                receiptId INTEGER PRIMARY KEY,
                items TEXT NOT NULL,
                subtotal INTEGER NOT NULL,
                ppn INTEGER NOT NULL,
                total INTEGER NOT NULL,
                orderType TEXT NOT NULL,
                paymentMethod TEXT NOT NULL,
                date TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                } else {
                    console.log('Created receipts table.');
                }
            });

            this._insertInitialData();
        });
    }

    _insertInitialData() {
        const initialProducts = [
            { id: '1', name: 'Coffee', price: 10000, category: 'coffee' },
            { id: '2', name: 'Tea', price: 8000, category: 'non-coffee' },
            { id: '3', name: 'Pop-Ice', price: 15000, category: 'non-coffee' },
            { id: '4', name: 'Sandwich', price: 15000, category: 'food' }
        ];

        initialProducts.forEach(product => {
            this._db.run(`INSERT OR IGNORE INTO products (id, name, price, category) VALUES (?, ?, ?, ?)`,
                [product.id, product.name, product.price, product.category],
                (err) => {
                    if (err) {
                        console.error('Error inserting initial product:', err.message);
                    }
                });
        });

        const saltRounds = 10;
        const defaultAdmin = { username: 'admin', password: 'password' };

        bcrypt.hash(defaultAdmin.password, saltRounds, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
            } else {
                this._db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)`,
                    [defaultAdmin.username, hashedPassword],
                    (err) => {
                        if (err) {
                            console.error('Error inserting initial admin:', err.message);
                        }
                    });
            }
        });

        const initialReceipt = {
            receiptId: 1,
            items: JSON.stringify([
                { name: 'Coffee', qty: 2, price: 10000 },
                { name: 'Sandwich', qty: 1, price: 15000 }
            ]),
            subtotal: 35000,
            ppn: 3500,
            total: 38500,
            orderType: 'Dine-In',
            paymentMethod: 'Cash',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        };

        this._db.run(`INSERT OR IGNORE INTO receipts (receiptId, items, subtotal, ppn, total, orderType, paymentMethod, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [initialReceipt.receiptId, initialReceipt.items, initialReceipt.subtotal, initialReceipt.ppn, initialReceipt.total, initialReceipt.orderType, initialReceipt.paymentMethod, initialReceipt.date],
            (err) => {
                if (err) {
                    console.error('Error inserting initial receipt:', err.message);
                } else {
                    console.log('Inserted initial receipt.');
                }
            });
    }

    get db() {
        return this._db;
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;
