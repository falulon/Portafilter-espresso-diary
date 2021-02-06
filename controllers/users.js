const catchAsync = require('../utils/catchAsync');
const getIP = require('../controllers/getip');
const User = require('../models/user');


module.exports.showRegister =
 (req,res) => {
    res.render('users/register');
}

module.exports.addNew =
catchAsync(
async (req,res) => {
    try{
    const {email, password} = req.body;
    const username = email;
    const city = await getIP.getCity();
    const user = new User ({username, email, password, city});
    const registeredUser = await User.register(user, password);
    
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome!' );
    res.redirect('/coffees/');
    });
    
    }catch(e)
    {
        req.flash('error', e.message );
        res.redirect('/register/');
}})

module.exports.showLogin =
  (req, res) => {
    res.render('users/login');
}


module.exports.login =
(req, res)=> {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/coffees/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }

  module.exports.logout =
  (req, res)=> {
    req.logout();
    req.flash('success', 'Goodbye! Log in to continue' );
    res.redirect('/login');
  }

  module.exports.forgot = 
  (req, res) => {
    res.render('users/forgot', {
      user: req.user
    });
  }

  
  module.exports.showReset =
   (req, res) =>{
    res.render('users/reset', {token: req.params.token}); 
   }

