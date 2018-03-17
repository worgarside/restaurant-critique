var mongoose = require('mongoose'), Schema = mongoose.Schema;

CategorySchema = Schema({
    _id: {type: String},
    name: {type: String, required: true, unique: true}
});

CategorySchema.pre('save', function (next) {
    var category = this;
    category._id = this.name.replace(/[^a-zA-Z0-9]/g, "");
    next();
});

mongoose.model('Category', CategorySchema);