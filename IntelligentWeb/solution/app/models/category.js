const mongoose = require('mongoose'), Schema = mongoose.Schema;

CategorySchema = Schema({
    _id: {type: String},
    name: {type: String, required: true, unique: true},
    updated_at: Date
});

CategorySchema.pre('save', function (next) {
    this._id = this.name.replace(/[^a-zA-Z0-9]/g, "");
    this.updated_at = Date.now();
    next();
});

mongoose.model('Category', CategorySchema);