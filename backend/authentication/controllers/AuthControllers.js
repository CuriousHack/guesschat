const authService = require('../services/AuthServices')

const register = async (req, res) => {
    const {firstname, lastname, email, password} = req.body
    //register the user and return response
    
    try{
        const token = await authService.registerUser(firstname, lastname, email, password);
        console.log(token)
        res.status(201).json({ success: true, token});
    }
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message });
    }
}

const login = (req, res) => {
    const {email, password } = req.body
    console.log(email, password)

    // verify user credentials and log the user in 

    //login the user and return response
    res.json('login route reached');
}

module.exports = {
    register,
    login
}