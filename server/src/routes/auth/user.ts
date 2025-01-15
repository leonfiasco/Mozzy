import express from 'express';
const router = express.Router();

const userController = require('../../controllers/auth/user');

router.post('/register', userController.user_register);

router.post('/login', userController.user_login);

router.get('/:id/verify/:token', userController.user_verfiy);

router.post('/resendVerificationLink', userController.user_resendVerification);

router.post('/resetpassword', userController.user_resetPassword);

router.post(
	'/resetpasswordconfirmation',
	userController.user_resetPasswordConfirmation
);

export default router;
