const {drinkRecorded, coffeeType} = require('../models/coffeetypes.js');
const drinkType = require('../models/drinks.js');
const User = require('../models/user');


module.exports.add = async(req, res) => {
    const userId = req.user._id; 

    const coffee = await coffeeType.findById(req.params.id);
    const drink = new drinkType(req.body.drink);
    coffee.weight -= drink.weight; //substract the weight from the total bag
    drink.coffeeBag = { id: coffee._id , name: coffee.name }; 
    coffee.drinks.push(drink);
    drinkRecorded.last = drink;

    const currentUser = await User.findById(coffee.user);
    currentUser.drinks.push(drink);
    
    await currentUser.save();
    await drink.save();
    await coffee.save();
    res.redirect(`/drinks?updated`)
}

module.exports.edit =  async (req, res) => {
    const drink = await drinkType.findById(req.params.id);
    res.render('drinks/edit', { drink });
};



module.exports.update = async (req, res) => {
    console.log("PUT SUCCESS");
    const { id } = req.params;
    const drink = await drinkType.findByIdAndUpdate(id, {...req.body.drink});
    res.redirect(`/drinks?updated`)
}



module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await drinkType.findByIdAndDelete(id);
    res.redirect('/drinks?updated');
}


module.exports.index = async(req, res)=>{
    const userId = req.user._id; 
    const drinks = await User.findOne(userId).populate('drinks');
    res.render('drinks/index', drinks);
}

