const mongoose = require('mongoose');
const {coffeeType} = require('../models/coffeetypes.js');
mongoose.connect('mongodb://localhost:27017/coffeetypes', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const seedsDB = async() => {
    await coffeeType.deleteMany({});

    const c1 = new coffeeType ({name: 'Ethiopia', roastLevel:0, weight: 500, date: '2021, 01, 11'});
    const c2 = new coffeeType ({ name: 'Kenya', roastLevel: 2, weight: 300, date: '2020, 12, 27' });
    const c3 = new coffeeType ({user: '60194bc21889e61330bdccaa', name: 'Blend', roastLevel:1, weight: 400, date: '2021, 01, 22'});
    await c1.save();
    await c2.save();
    await c3.save();
}


seedsDB().then(() => {
    mongoose.connection.close();
    console.log('db is disconnected');
});