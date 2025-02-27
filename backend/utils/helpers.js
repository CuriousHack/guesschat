const error = (code, message) => {
    const error = new Error(message)
    error.statusCode = code
    throw error
}

const generateUsername = (firstname) => {
    const randomFourDigits = Math.floor(1000 + Math.random() * 9000);
    const username = firstname.toLowerCase() + randomFourDigits;
    return username;
}

module.exports = {
    error,
    generateUsername
}