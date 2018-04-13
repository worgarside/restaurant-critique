/**
 * Definition of the Category mongoose Schema
 * A Category is a child document of a Restaurant and is used in setting the cuisine (etc.) type
 * @author Will Garside
 */

// ================ Middleware ================ \\

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ================ Category Schema Definition ================ \\

CategorySchema = Schema({
    _id: {type: String},
    name: {type: String, required: true},
    updatedAt: Date
});

CategorySchema.pre('save', function (next) {
    // The name of the Category has all special chars removed to create the _id
    this._id = this.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Category', CategorySchema);