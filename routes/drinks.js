const express = require('express');
var router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const drinkType = require('../models/drinks.js');
const {validateDrinkType, isLoggedIn, isUser} = require('../middleware');
const drinks = require('../controllers/drinks');


router.post('/coffees/:id/', validateDrinkType, isLoggedIn, isUser, catchAsync(drinks.add));


router.get('/:id/edit', isLoggedIn, drinks.edit);


router.put('/:id', validateDrinkType, isLoggedIn,  catchAsync(drinks.update));

router.delete('/:id', isLoggedIn,  catchAsync(drinks.delete));


router.get('/', isLoggedIn, drinks.index);
// router.get('/count', isLoggedIn, drinks.countByDays);


router.get('/all', async(req, res)=>{
    const drinks = await drinkType.find();
    res.render('drinks/index', {drinks});
});


module.exports = router;