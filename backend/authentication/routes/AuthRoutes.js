const express = require('express');
const authController = require('../controllers/AuthControllers');
const {loginSchema, registerSchema} = require('../validation/authValidation');
const validateRequest = require('../../middleware/validateRequest')

const router = express.Router();

router.get('/', (req, res) => {
    console.log('auth level reached')
})

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);

module.exports = router