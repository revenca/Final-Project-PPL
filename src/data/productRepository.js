const db = require('../infrastructure/db').db;

const productRepository = {
    add: (product, callback) => {
        const sql = `INSERT INTO products (id, name, price, category) VALUES (?, ?, ?, ?)`;
        const params = [product.id, product.name, product.price, product.category];
        db.run(sql, params, (err) => {
            callback(err);
        });
    },
    getAll: (callback) => {
        const sql = `SELECT * FROM products`;
        db.all(sql, [], (err, rows) => {
            callback(err, rows);
        });
    },
    delete: (id, callback) => {
        const sql = `DELETE FROM products WHERE id = ?`;
        db.run(sql, [id], (err) => {
            callback(err);
        });
    }
};

module.exports = productRepository;
