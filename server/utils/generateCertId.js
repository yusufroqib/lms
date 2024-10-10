const crypto = require('crypto');

function generateCertId(userId) {
    const prefix = 'LRNV';
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD format
    const hash = crypto.createHash('sha256').update(userId).digest('hex').slice(0, 8).toUpperCase(); // 8-char hash
    const randomPart = Math.random().toString(36).substr(2, 5).toUpperCase(); // 5-char alphanumeric
    return `${prefix}-${datePart}-${hash}-${randomPart}`;
}

module.exports = generateCertId;


