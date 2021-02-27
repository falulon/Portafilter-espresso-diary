const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const forgotPass = require('../controllers/forgotPassword');
const {isFreshUser, isRegistered} = require('../middleware');


router.get('/about', (req, res)=> {
  req.flash('', '');
  res.render('about');
})


router.get('/',isFreshUser, (req, res)=> {
  res.redirect('/coffees');
})



router.route('/register')
  .get(users.showRegister) 
  .post( isRegistered ,users.addNew )


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