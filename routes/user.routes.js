import express from 'express';
import { signUp,signIn,forgetPassword } from '../controllers/user.controller.js';

const router = express.Router();


router.post('/signin',signIn);
router.post('/signup',signUp);
router.post('/forget-password',forgetPassword);


export default router;