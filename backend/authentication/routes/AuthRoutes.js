const express = require('express');
const authController = require('../controllers/AuthControllers')

const router = express.Router();

router.get('/', (req, res) => {
    console.log('auth level reached')
})

router.get('/register', authController.register);
router.get('/login', authController.login);

module.exports = router