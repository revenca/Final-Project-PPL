const db = require('../infrastructure/db').db;

const userRepository = {
    findByUsername: (username, callback) => {
        const sql = `SELECT * FROM admins WHERE username = ?`;
        db.get(sql, [username], (err, row) => {
            callback(err, row);
        });
    }
};

module.exports = userRepository;
