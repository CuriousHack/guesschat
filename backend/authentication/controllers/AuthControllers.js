const authService = require('../services/AuthServices')

const register = async (req, res) => {
    try{
        const {username, email, password} = req.body;
        //register the user and return response
        const token = await authService.registerUser(username, email, password);
        res.status(201).json({ success: true, message: 'Account created successfully', token: token});
    }
    catch(err){
        res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
}

const login = async (req, res) => {
    try{
        const { email, password } = req.body
        const token = await authService.loginUser(email, password);
        res.status(200).json({ success: true, token: token });
    }
    catch(err){
        console.log(err)
        res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
}

module.exports = {
    register,
    login
}