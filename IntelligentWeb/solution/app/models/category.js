// ================ Middleware ================ \\

const mongoose = require('mongoose'), Schema = mongoose.Schema;

// ================ Category ================ \\

CategorySchema = Schema({
    _id: {type: String},
    name: {type: String, required: true},
    updatedAt: Date
});

CategorySchema.pre('save', function (next) {
    this._id = this.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Category', CategorySchema);