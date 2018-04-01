// ================ Middleware ================ \\

const mongoose = require('mongoose');
const database = {
    username: 'worgarside',
    password: 'V9hG0P3a025bnbTY',
    name: 'restaurant_critique'
};

// ================ Database Manager ================ \\

function connect(nextFunction) {
    return mongoose.connect(`mongodb+srv://${database.username}:${database.password}@restaurant-critique-gct1h.mongodb.net/`, {dbName: database.name})
        .then(() => {
            console.log(`Connected to mongodb+srv://${database.username}@restaurant-critique-gct1h.mongodb.net`);
            if (nextFunction) {
                nextFunction();
            }
        })
        .catch((err) => {
            console.log(`Failed to connect to DB: ${err}`);
            process.exit(1);
        });
}

module.exports.connect = connect;