const register = (req, res) => {
    
    //register the user and return response
    res.send('registration route reached');
}

const login = (req, res) => {
    //login the user and return response
    res.send('login route reached');
}

module.exports = {
    register,
    login
}