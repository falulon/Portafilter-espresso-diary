
const ExpressError = require('./utils/ExpressError');
const { coffeeTypeSchema, drinkTypeSchema} = require('./schemas.js');
const {coffeeType} = require('./models/coffeetypes.js');


module.exports.validateCoffeeType = (req, res, next) => {
    const { error } = coffeeTypeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};


module.exports.validateDrinkType = (req, res, next) => {
    const { error } = drinkTypeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Please login first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isLoggedInAndRegistered = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        return res.redirect('/register');
    }
    next();
}


module.exports.isFreshUser = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        return res.redirect('/users/landing');
    }
    next();
}



module.exports.isUser = async (req, res, next) => {
    const { id } = req.params;
    const coffee = await coffeeType.findById(id);
        
    if (!coffee.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/coffees/${id}`);
    }
    next();
}