var mongoose = require('mongoose'), Schema = mongoose.Schema;

CategorySchema = Schema({
    _id: {type: String},
    name: {type: String, required: true, unique: true}
});

mongoose.model('Category', CategorySchema);