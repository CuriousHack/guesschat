const User = require('../models/userModel');
const { generateUsername } = require('../../utils/helpers')

const generateUniqueUsername = async (firstname) => {
    //check for existing username, if present run the username generator again
    let username;
    let userExists;

    do {
        username = generateUsername(firstname);
        userExists = await User.findOne({ username });
    } while (userExists);

    return username;
};

module.exports = { generateUniqueUsername };
