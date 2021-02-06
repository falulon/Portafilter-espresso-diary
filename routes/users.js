const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const forgotPass = require('../controllers/forgotPassword');


router.get('/about', (req, res)=> {
  res.render('about');
})

router.route('/register')
  .get(users.showRegister) 
  .post( users.addNew )


router.route('/login')
  .get(users.showLogin)
  .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)


router.get('/logout', users.logout)

router.route('/forgot')
  .get( users.forgot)
  .post( forgotPass.assignToken, forgotPass.emailToken, forgotPass.tokenSent ) 

router.route('/reset/:token')
  .get(forgotPass.checkToken, users.showReset)
  .post(forgotPass.checkToken, forgotPass.resetPass)


module.exports = router;