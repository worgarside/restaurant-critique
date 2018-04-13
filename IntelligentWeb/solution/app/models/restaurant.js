// ================ Middleware ================ \\

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');
const Category = mongoose.model('Category');
const CategorySchema = Category.schema;
const nodemailer = require(`${appRoot}/config/nodemailer`);

// ================ Restaurant ================ \\

RestaurantSchema = Schema({
    name: {type: String, required: true},
    address: {
        line1: {type: String, required: true},
        line2: {type: String, trim: true},
        city: {type: String, trim: true},
        postcode: {type: String, trim: true, required: true},
        formattedAddress: {type: String, searchable: true},
        latitude: {type: Number, min: -90, max: 90, default: 90},
        longitude: {type: Number, min: -180, max: 180, default: 180}
    },
    location: {
        type: {type: String},
        coordinates: [Number]
    },
    contact: {
        url: {type: String, trim: true},
        menu: {type: String, trim: true},
        phone: {type: String, trim: true}, //TODO: restaurant email address for contact purposes as well as phone??
    },
    localUrl: {type: String, unique: true},
    openingTimes: Array,
    description: {type: String, default: 'No description currently available.'},
    priceRange: {
        lower: Number,
        upper: Number,
        band: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    categories: {type: [CategorySchema]},
    features: {
        alcohol: {name: {type: String, default: 'Alcohol'}, value: Boolean},
        americanExpress: {name: {type: String, default: 'Accepts American Express'}, value: Boolean},
        creditCard: {name: {type: String, default: 'Accepts credit cards'}, value: Boolean},
        delivery: {name: {type: String, default: 'Delivery'}, value: Boolean},
        highchairs: {name: {type: String, default: 'Highchairs Available'}, value: Boolean},
        glutenFree: {name: {type: String, default: 'Gluten Free options'}, value: Boolean},
        mastercard: {name: {type: String, default: 'Accepts Mastercard'}, value: Boolean},
        outdoorSeating: {name: {type: String, default: 'Outdoor Seating'}, value: Boolean},
        parking: {name: {type: String, default: 'Dedicated Parking'}, value: Boolean},
        reservations: {name: {type: String, default: 'Reservations'}, value: Boolean},
        seating: {name: {type: String, default: 'Seating'}, value: Boolean},
        tableService: {name: {type: String, default: 'Table Service'}, value: Boolean},
        takeout: {name: {type: String, default: 'Takeout'}, value: Boolean},
        vegetarian: {name: {type: String, default: 'Vegetarian options'}, value: Boolean},
        vegan: {name: {type: String, default: 'Vegan options'}, value: Boolean},
        visa: {name: {type: String, default: 'Accepts Visa'}, value: Boolean},
        wheelchairAccessible: {name: {type: String, default: 'Wheelchair accessible'}, value: Boolean},
        wifi: {name: {type: String, default: 'Free WiFi'}, value: Boolean}
    },
    creator: { // These are of type User, but only some fields - db is not relational
        _id: {type: String, required: true},
        name: {first: String, last: String},
    },
    owner: { // These are of type User, but only some fields - db is not relational
        _id: String,
        name: {first: String, last: String}
    },
    ownerMessage: {type: String},
    reviews: {type: [String], default: []},
    images: {type: [String], default: []}, //TODO: only show top 5 images on nearby page?
    averageRating: {type: Number, min: 0, max: 5},
    published: {type: Boolean, default: true},
    updatedAt: Date,
    searchable: {
        all: String,
        name: String,
        description: String,
        formattedAddress: String,
        categories: String
    }
});

RestaurantSchema.pre('save', function (next) {
    if ((this.address.latitude) && (this.address.longitude)) {
        this.location = {
            type: "Point",
            coordinates: [this.address.longitude, this.address.latitude] // long THEN lat, according to geoJSON standards
        };
    }

    const imageDir = `./public/images/restaurants/${this._id}`;
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir);
    }

    this.address.postcode = this.address.postcode.toUpperCase();
    this.address.formattedAddress = '';
    const addressComponents = ['line1', 'line2', 'city', 'postcode'];
    Object.keys(this.address).forEach((key, index, keys) => {
        const value = this.address[key];
        if (value && addressComponents.includes(key)) {
            this.address.formattedAddress += value;
            if (addressComponents.includes(keys[index + 1])) {
                this.address.formattedAddress += ', ';
            }
        }
    });

    for (const category of this.categories) {
        new Category(category).save().catch((err) => {
            if (!err.errmsg.includes('duplicate key')) {
                console.log(err.errmsg);
            }
        })
    }

    this.localUrl = `${this.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}-${this.address.postcode.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;
    this.updatedAt = Date.now();

    if (!dbRegen){
        emailCreator(this);
    }

    this.searchable.name = this.name.replace(/[^\w\s]/, '');
    this.searchable.description = this.description.replace(/[^\w\s]/, '');
    this.searchable.formattedAddress = this.address.formattedAddress.replace(/[^\w\s]/, '');
    this.searchable.all = `${this.searchable.name} ${this.searchable.description} ${this.searchable.formattedAddress}`;

    next();
});

function emailCreator(restaurant){
    const to = restaurant.creator._id;
    const subject = 'Restaurant creation confirmation';
    const body = `
        <p>${restaurant.creator.name.first} ${restaurant.creator.name.last},</p>
        <p>This is your confirmation email for creating ${restaurant.name} at ${restaurant.address.postcode} on <a href="www.restaurantcritique.com">Restaurant Critique.</a></p>
        <p>Thank you for contributing to the community!</p>
        <p>Please note your submission may take up to 24 hours to appear on the website, if you do not see it after this time <strong>do not</strong> re-submit it. Instead please contact us <a href="www.restaurantcritique.com/contact">here</a>.</p>
    `;
    nodemailer.sendEmail(to, subject, body);
}

module.exports = mongoose.model('Restaurant', RestaurantSchema);