const db = require('../infrastructure/db');

const userRepository = {
    findByUsername: (username, callback) => {
        const sql = 'SELECT * FROM admins WHERE username = ?';
        db.get(sql, [username], callback);
    }
};

module.exports = userRepository;