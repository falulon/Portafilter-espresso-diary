const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const drinkSchema = new Schema({
    type: {
        type: String,
        // enum: ["Espresso", "Double Espresso","Cappucino", "Americano", "Mocha", "Latte", "Macchiato", "Filter", "French Press", "AeroPress", "Cold Brew", "Chemex", "V60", "Turkish", "Cortado", "Ristretto", "Other", "Tea" ],
        required: [true, 'Beverage type is required']
    },

    weight: {
        type: Number
      
    },
    
    drinkWeight: {
        type: Number
    },
    date: {
        type: Date,
        default: Date() 
    },
    temperature: {
        type: Number
    },    
    grindLevel: {
        type: Number,
        default: 0
    },    
    tampingLevel: {
        type: Number,
        enum: [0, 1,2]
    },
    infusionLength: {
        type: String
    },
    comment: {
        type: String
    },
    nextTimeNote: {
        type: String
    },
    coffeeBag: {
        type: Object
    }

    
});

drinkSchema.virtual('img').get(function() {
    switch (this.type) {
        case "Macchiato":
            return '/img/macchiato_Ning_Shi.webp';
        case "Mocha":
            return '/img/moccha_hanna_balan.webp';
        case "Cappucino":
        case "Latte":
            return '/img/cappucino_y_caiphoto-1585747733279-8f64c2b71381.webp';
        case "AeroPress":
        case "Chemex":
        case "V60":
            return '/img/press-photo-1574359173025-c104b8f9c5d9.webp';
        case "Ice tea":
        case "Cold Brew":
            return '/img/filter_photo-1550157849-04fdbd5d5e2c_c.webp';
        case "Turkish":
            return '/img/turkish_photo-1586195832009-0113f8cdd6d5.webp';
        case "Filter":
            return '/img/filter_photo_conor_brown.webp';
        default:
            return '/img/espresso.webp';
    }
    
  });
  
  drinkSchema.virtual('tampingLevelText').get(function() {
    switch (this.tampingLevel) {
        case 0:
            return '💪🏻 x1';
        case 1:
            return '💪🏻 x2';
        case 2:
            return '💪🏻 x3' ;
        
    }
    
  });
  
  
drinkSchema.virtual('infusionLengthRound').get(function() {
    let seconds = parseFloat(this.infusionLength.replace(":","."));
            return (Math.round(seconds * 2) / 2)   ;   
  });
  
  drinkSchema.virtual('ratio').get(function() {
    if (this.drinkWeight && this.weight) {
        return Math.round((this.drinkWeight / this.weight)* 10) / 10; }
    
            
  });



module.exports = mongoose.model('Drink', drinkSchema);