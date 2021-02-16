const express = require('express');

const ExpressError = require('../utils/ExpressError');
const {drinkRecorded, coffeeType} = require('../models/coffeetypes.js');

// const validateCoffeeType = require('../middleware')();
const User = require('../models/user');


module.exports.index = 
async(req, res)=>{
    const userId = req.user._id; 
    const coffees = (await User.findById(userId).populate('coffees')).coffees;
    const coffeesArchived = (await User.findById(userId).populate({path: 'coffees', 
    match: {archivedAt: { $exists: true }}})).coffees;
    res.render(`coffees/index.ejs`, ({coffeesArchived, coffees}))
};


module.exports.showArchive = 
async(req, res)=>{
    const userId = req.user._id; 
    const coffees = await User.findById(userId).populate({path: 'coffees', 
   match: {archivedAt: { $exists: true }}});
    
    res.render('coffees/index', coffees)
};

module.exports.new= async(req, res) => {
    res.render('coffees/new')
}

module.exports.add = async(req, res) => {
    const coffee = new coffeeType(req.body.coffee);
    coffee.user = req.user._id; 
    const currentUser = await User.findById(coffee.user);
    currentUser.coffees.push(coffee);

    await coffee.save();
    await currentUser.save();


    res.redirect(`/coffees`)
}

module.exports.show = async(req, res) => {
    const coffee = await coffeeType.findById(req.params.id);
    const lastDrink = drinkRecorded.last || ""; 

    res.render('coffees/show', {coffee, lastDrink})
}

module.exports.edit = async (req, res) => {
    const coffee= await coffeeType.findById(req.params.id)
    res.render('coffees/edit', { coffee });
}

module.exports.update = async (req, res) => {
    console.log("PUT SUCCESS");
    const { id } = req.params;
    const coffee = await coffeeType.findByIdAndUpdate(id, { ...req.body.coffee});
    res.redirect(`/coffees/${coffee._id}`)
}


module.exports.unArchive =  async (req, res) => {
const { id } = req.params;
    const coffee = await coffeeType.findById(id).where('archivedAt').exists();
    coffee.restore();
    req.flash('success', 'The bag is back to be active' );
    res.redirect('/coffees');
};

module.exports.archive =  async (req, res) => {
    const { id } = req.params;
    const coffee = await coffeeType.findById(id)
    coffee.archive();
    req.flash('success', 'Bag archived!' );
    res.redirect('/coffees');
}

module.exports.delete =  async (req, res) => {
    const { id } = req.params;
    const coffee = await coffeeType.findById(id)
    await coffeeType.findByIdAndDelete(id);
    req.flash('success', 'The bag was permenantly deleted' );
    res.redirect('/coffees');
}