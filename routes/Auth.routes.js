import express from 'express';
import { signUp,signIn,login,adminLogin,logout } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', login);
router.get('/login', login);
router.get('/logout', logout);
router.post('/login',adminLogin);


router.get('/pages-lock-screen', function(req, res)
{
      res.locals = {  title: 'Lock Screen' };
      res.render('Auth/pages_lock_screen');
});
router.get('/pages-404', function(req, res)
{
      res.locals = {  title: '404 Page Error' };
      res.render('Auth/pages_404');
});
router.get('/pages-500', function(req, res)
{
      res.locals = {  title: '500 Page Error' };
      res.render('Auth/pages_500');
});
export default router;