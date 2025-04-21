const jwt = require('jsonwebtoken');
const  User  = require('../authentication/models/userModel');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]; // Expect "Bearer <token>"
        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findOne({ email: decoded.email })

        if (!user) {
            return res.status(401).json({ error: "Invalid token." });
        }

        req.user = user; // Attach user data to request
        next();
    } catch (error) {
        // console.error("Auth Middleware Error:", error);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};


module.exports = authMiddleware;