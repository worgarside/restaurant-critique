const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://worgarside:V9hG0P3a025bnbTY@restaurant-critique-gct1h.mongodb.net/restaurant_critique';
MongoClient.connect(uri, function(err, client) {
    const collection = client.db("restaurant_critique").collection("restaurants");
    // perform actions on the collection object
    client.close();
});