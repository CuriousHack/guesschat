const crypto = require('crypto');
const error = (code, message) => {
    const error = new Error(message)
    error.statusCode = code
    throw error
}

const generateCode = (length = 7) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const bytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }

  return result;
}


module.exports = {
    error,
    generateCode
}