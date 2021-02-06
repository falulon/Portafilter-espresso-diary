const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
// import mongooseArchive from 'mongoose-archive';
const mongooseArchive = require('mongoose-archive');


const coffeeTypeSchema = new Schema({
    name: {
        type: String, 
        required: [true, 'Name is required']
    },
    weight: {
        type: Number, 
        required: [true, 'Weight is required']
    },
    roastLevel: {
        type: Number,
        enum: [0, 1,2]
    },
    date: {
        type: Date,
        default: Date.Now 
    }, 
    drinks: [{
        type: Schema.Types.ObjectId, 
        ref: 'Drink'
    }], 
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

coffeeTypeSchema.plugin(mongooseArchive);

coffeeTypeSchema.virtual('roastLevelText').get(function() {
    const roast = this.roastLevel; 

    if (roast === 0) return "Light" ;
    else if (roast === 1) return "Medium";
    return "Dark";
  });
  

coffeeTypeSchema.virtual('remainingShots').get(function() {
    const dbl = Math.floor(this.weight / 13); 
    const single = Math.floor(this.weight / 8); 
    if (dbl>0) {if (dbl !== single && dbl > 0) return (`${dbl}-${single}`); 
     return dbl;} 

  });

coffeeTypeSchema.virtual('ageInDays').get(function() {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(this.date);
    const secondDate = new Date();
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay) - 1 );
return diffDays;
});  
  
module.exports.drinkRecorded = {};  
module.exports.coffeeType = mongoose.model('coffeeType', coffeeTypeSchema);