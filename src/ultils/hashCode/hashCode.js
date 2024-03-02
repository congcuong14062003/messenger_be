const crypto = require('crypto');

export default function hashText(text) {
    const hash = crypto.createHash('sha256'); // Sử dụng thuật toán SHA-256
    hash.update(text);
    return hash.digest('hex'); // Trả về mã hash dưới dạng hex
}
