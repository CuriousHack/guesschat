const User = require('../models/userModel');
const { error } = require('../../utils/helpers');
const { generateToken } = require('../../utils/jwt');

const registerUser = async (username, email, password) => {
    //store information in database and return new data
    const userExist = await User.findOne({ email })
    if(userExist) error(409, 'User Already Exist')
    const usernameExist = await User.findOne({ username })   
    if(usernameExist) error(409, 'Username already chosen')

    const newUser = await User.create({ username, email, password})
    
    return generateToken(newUser)
}

const loginUser = async (email, password) => {
    //retrieve information and log user in
    const user = await User.findOne({ email });
    if(!user) error(401, 'Invalid Credentials');
    // check if password is valid 
    const passwordMatch = await user.isValidPassword(password);
    if(!passwordMatch) error(401, 'Invalid Credentials');
    
    return generateToken(user)
}

module.exports = {
    registerUser,
    loginUser
}