const express = require('express');
var router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
// const ExpressError = require('../utils/ExpressError');
const coffees = require('../controllers/coffees');
const {validateCoffeeType, isLoggedIn, isUser} = require('../middleware');


router.route('/')
    .get(isLoggedIn, catchAsync(coffees.index))
    .post(validateCoffeeType, isLoggedIn, catchAsync(coffees.add))

router.get('/new', isLoggedIn, coffees.new)
router.get('/archive', isLoggedIn, catchAsync (coffees.showArchive))
router.put('/makeActive/:id',  isLoggedIn, catchAsync (coffees.unArchive))
router.put('/archive/:id',  isLoggedIn, catchAsync (coffees.archive))

router.route('/:id')
    .get(isLoggedIn, coffees.show)
    .put(validateCoffeeType , isLoggedIn, isUser, catchAsync(coffees.update))
    .delete(catchAsync(coffees.delete))


router.get('/:id/edit', isLoggedIn, isUser, coffees.edit);


module.exports = router;


