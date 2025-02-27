const User = require('../models/userModel');
const { error } = require('../../utils/helpers');
const { generateToken } = require('../../utils/jwt')

const registerUser = async (firstname, lastname, email, password) => {
    //store information in database and return new data
    const userExist = await User.findOne({ email });
    if(userExist) error(409, 'User Already Exist');

    const newUser = await User.create({ firstname, lastname, email, password});
    return generateToken(newUser)
}

module.exports = {
    registerUser
}