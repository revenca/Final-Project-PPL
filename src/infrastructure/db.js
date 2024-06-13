const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../data/database.sqlite');
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

    // Tambahkan admin default jika tidak ada
    const defaultAdmin = { username: 'admin', password: '$2b$10$4UG4VYGnaP5Z.EASOlxDXuF3j8n7CvZV4xeQ9Pj.q8v3uoX1/Bj1u' }; // password: "password" hashed
    db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)`, [defaultAdmin.username, defaultAdmin.password]);
});

module.exports = db;
