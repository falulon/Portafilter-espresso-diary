const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema ({
    email: {
        type: String,
        lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: true,
        required : true,
        unique: true
    },
    city: {
        type: String, 
        default:"NA" 
    },
    country: {
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    drinks: [{
        type: Schema.Types.ObjectId, 
        ref: 'Drink'
    }], 
    coffees:
    [{
        type: Schema.Types.ObjectId, 
        ref: 'coffeeType'
}]

},  { timestamps: true });


UserSchema.plugin(passportLocalMongoose); //adding the password + username from passport

module.exports =  mongoose.model('User', UserSchema);