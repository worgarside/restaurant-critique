/**
 * A file of hard-coded data for populating the database with test data.
 * Run by the db_regen file as a one-time operation
 * @author Will Garside, Greta Ramaneckaite
 */

// ================ Middleware & Constants ================ \\

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Category = mongoose.model('Category');
const Restaurant = mongoose.model('Restaurant');
const Review = mongoose.model('Review');

const ID = {
    "Aslan's": '5ab1677c521e5430fc7d2490',
    "Nando's": '5ab1677c521e5430fc7d2491',
    'Gourmet Burger Kitchen': '5ab1677c521e5430fc7d2492',
    'Wagamama': '5ab1677c521e5430fc7d2493',
    'Siam Thai and Teppanyaki': '5ab1677c521e5430fc7d2494',
    'Handmade Burger Co.': '5ab1677c521e5430fc7d2495',
    'Miller & Carter': '5ab1677c521e5430fc7d2496',
    'Almost Famous': '5ab1677c521e5430fc7d2497',
    'Bungalows & Bears': '5ab1677c521e5430fc7d2498',
    'Istanbul Restaurant': '5ab1677c521e5430fc7d2499',
    'Piccolino': '5ab1677c521e5430fc7d2500',
    'Pizza Express': '5ab1677c521e5430fc7d2501',
    'Las Iguanas': '5ab1677c521e5430fc7d2502',
    'California Fresh': '5ab1677c521e5430fc7d2503',
};

// ================ Database ================ \\

/**
 * Calls each Schema's population function
 * @param {Array} insertPromises An array of Promises which all have to be fulfilled before disconnecting from the database
 */
const populateFunction = function populateDatabase(insertPromises) {
    populateCategories(insertPromises);
    populateUsers(insertPromises);
    populateRestaurants(insertPromises);
    populateReviews(insertPromises);
};

/**
 * Populates the 'Categories' collection of the database
 * @param {Array} insertPromises Array of Model.Save() Promises to be fulfilled before database disconnection
 */
function populateCategories(insertPromises) {
    const categories = [
        'African', 'American', 'Arabic', 'Argentinian', 'Asian', 'Australian', 'Balti', 'Bangladeshi', 'Bar',
        'Barbecue', 'Brazilian', 'Brew Pub', 'British', 'Cafe', 'Canadian', 'Cantonese', 'Caribbean',
        'Central American', 'Central European', 'Chinese', 'Colombian', 'Contemporary', 'Cuban', 'Delicatessen',
        'Diner', 'Eastern European', 'Egyptian', 'Ethiopian', 'European', 'Fast Food', 'French', 'Fusion',
        'Gastropub', 'Georgian', 'German', 'Greek', 'Grill', 'Healthy', 'Hong Kong', 'Hungarian', 'Indian',
        'International', 'Italian', 'Jamaican', 'Japanese', 'Korean', 'Latin', 'Lebanese', 'Malaysian',
        'Mediterranean', 'Mexican', 'Middle Eastern', 'Minority Chinese', 'Moroccan', 'Nepalese', 'New Zealand',
        'North Eastern Chinese', 'Pakistani', 'Persian', 'Peruvian', 'Pizza', 'Polish', 'Portuguese', 'Pub',
        'Romanian', 'Russian', 'Scandinavian', 'Seafood', 'Shanghai', 'Soups', 'South American', 'Southwestern',
        'Spanish', 'Sri Lankan', 'Steakhouse', 'Street Food', 'Sushi', 'Szechuan', 'Taiwanese', 'Thai', 'Tunisian',
        'Turkish', 'Vietnamese', 'Wine Bar'
    ];

    for (let i = 0; i < categories.length; i++) {
        insertPromises.push(new Category({name: categories[i]}).save());
    }
}

/**
 * Populates the 'Users' collection in the database with test data
 * @param {Array} insertPromises Array of Model.Save() Promises to be fulfilled before database disconnection
 */
function populateUsers(insertPromises) {
    insertPromises.push(new User({
        _id: 'copeyrufus@gmail.com',
        password: 'Caddy1',
        name: {first: 'Rufus', last: 'Cope'},
        ageCategory: 2,
        postcode: 'S10 2DN',
        reviews: [],
        displayImage: 'copeyrufus-gmail-com',
        restaurants: {created: [ID['Wagamama'], ID['Siam Thai and Teppanyaki'], ID['Miller & Carter'], ID['Bungalows & Bears'], ID["California Fresh"]]}
    }).save());

    insertPromises.push(new User({
        _id: 'greta.veronika@gmail.com',
        password: 'Vodka2',
        name: {first: 'Greta', last: 'Ramaneckaite'},
        ageCategory: 2,
        postcode: 'S10 2FL',
        reviews: [],
        displayImage: 'greta-veronika-gmail-com',
        restaurants: {created: [ID['Handmade Burger Co.'], ID['Almost Famous'], ID['Piccolino'], ID["Las Iguanas"]]}
    }).save());

    insertPromises.push(new User({
        _id: 'worgarside@gmail.com',
        password: 'Passw3rd',
        name: {first: 'Will', last: 'Garside'},
        ageCategory: 2,
        postcode: 'SY14 8JU',
        reviews: [],
        displayImage: 'worgarside-gmail-com',
        restaurants: {created: [ID["Nando's"], ID['Gourmet Burger Kitchen'], ID['Istanbul Restaurant'], ID['Pizza Express']]}
    }).save());

    insertPromises.push(new User({
        _id: 'aslan@chicken-shop.com',
        email: 'aslan@chicken-shop.com',
        password: 'Asl4n',
        name: {first: 'Aslan', last: 'Chicken'},
        ageCategory: 2,
        postcode: 'S1 4EW',
        reviews: [],
        displayImage: 'aslan-chicken-shop-com',
        restaurants: {
            created: [ID["Aslan's"]],
            owned: [ID["Aslan's"]]
        }
    }).save());
}

/**
 * Populates the 'Restaurants' collection of the database with varied test data
 * @param {Array} insertPromises Array of Model.Save() Promises to be fulfilled before database disconnection
 */
function populateRestaurants(insertPromises) {
    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID["Aslan's"]),
        name: "Aslan's Kebab",
        address: {
            line1: '187',
            line2: 'West Street',
            city: 'Sheffield',
            postcode: 'S1 4EW',
            latitude: 53.380002,
            longitude: -1.480078
        },
        contact: {
            phone: '01144345634'
        },
        openingTimes: [[540, 1020], [540, 1020], [540, 1020], [540, 1020], [540, 1020], [540, 1020], [540, 1020]],
        description: 'Local kebab house with mixed reviews. A favourite with students and people with low hygiene standards',
        priceRange: {lower: 2.5, upper: 7, band: 1},
        categories: [
            {name: 'Fast Food'}, {name: 'Chicken'}, {name: 'Convenient'}, {name: 'Inexpensive'},
            {name: 'Late Night Food'}, {name: 'Kebab'}
        ],
        features: {
            alcohol: {value: false},
            creditCard: {value: true},
            delivery: {value: false},
            highchairs: {value: false},
            glutenFree: {value: false},
            mastercard: {value: true},
            outdoorSeating: {value: false},
            parking: {value: false},
            reservations: {value: false},
            seating: {value: true},
            tableService: {value: false},
            takeout: {value: true},
            vegetarian: {value: true},
            vegan: {value: false},
            visa: {value: true},
            wheelchairAccessible: {value: true},
            wifi: {value: false}
        },
        creator: {_id: 'aslan@chicken-shop.com', name: {first: 'Aslan', last: 'Chicken'}},
        owner: 'aslan@chicken-shop.com',
        ownerMessage: "Please come and buy my chicken, I don't want to close again!",
        reviews: ['5aad98377888995220605d09', '5aad98377888995220605d10'],
        images: ['2018-03-17 22-25-18.png', '2018-03-17 22-26-11.png', '2018-03-17 22-31-42.jpg'],
        averageRating: 3
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID["Nando's"]),
        name: "Nando's",
        address: {
            line1: 'Royal Plaza Development',
            line2: 'West Street',
            city: 'Sheffield',
            postcode: 'S1 4EZ',
            latitude: 53.380494,
            longitude: -1.477221
        },
        contact: {
            url: 'https://www.nandos.co.uk',
            menu: 'https://www.nandos.co.uk/food/menu',
            phone: '01142780044'
        },
        openingTimes: [[690, 1380], [690, 1380], [690, 1380], [690, 1380], [690, 1380], [690, 1380], [690, 1380]],
        description: 'Afro-Portuguese chain restaurant serving flame-grilled chicken in spicy chilli sauce.',
        priceRange: {lower: 3.95, upper: 15.2, band: 2},
        categories: [
            {name: 'Chicken'}, {name: 'Portuguese'}, {name: 'Spicy'},
            {name: 'Burgers'}, {name: 'Casual'}
        ],
        features: {
            alcohol: {value: true},
            americanExpress: {value: true},
            creditCard: {value: true},
            delivery: {value: true},
            highchairs: {value: true},
            glutenFree: {value: true},
            mastercard: {value: true},
            outdoorSeating: {value: false},
            parking: {value: false},
            reservations: {value: false},
            seating: {value: true},
            tableService: {value: false},
            takeout: {value: true},
            vegetarian: {value: true},
            vegan: {value: true},
            visa: {value: true},
            wheelchairAccessible: {value: true},
            wifi: {value: false}
        },
        creator: {_id: 'worgarside@gmail.com', name: {first: 'Will', last: 'Garside'}},
        reviews: ['5aad98377888995220605d16'],
        images: ['2018-03-25 19-33-00.jpg', '2018-03-25 19-33-01.jpg', '2018-03-25 21-48-00.jpg'],
        averageRating: 2
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID['Gourmet Burger Kitchen']),
        name: 'Gourmet Burger Kitchen',
        address: {
            line1: 'Unit 8',
            line2: '24 The Moor',
            city: 'Sheffield',
            postcode: 'S1 4PA',
            latitude: 53.377303,
            longitude: -1.473198
        },
        contact: {
            url: 'https://www.gbk.co.uk',
            menu: 'https://www.gbk.co.uk/menu',
            phone: '0114 275 5154'
        },
        openingTimes: [[690, 1320], [690, 1320], [690, 1320], [690, 1320], [690, 1320], [690, 1320], [690, 1320]],
        description: 'Chain restaurant with classic wooden decor, serving gourmet British beef, chicken or veggie burgers.',
        priceRange: {lower: 5, upper: 11.35, band: 2},
        categories: [
            {name: 'Spicy'}, {name: 'Burgers'}, {name: 'Casual'}, {name: 'American'}
        ],
        features: {
            alcohol: {value: true},
            americanExpress: {value: true},
            creditCard: {value: true},
            delivery: {value: true},
            highchairs: {value: true},
            glutenFree: {value: true},
            mastercard: {value: true},
            outdoorSeating: {value: false},
            parking: {value: false},
            reservations: {value: false},
            seating: {value: true},
            tableService: {value: false},
            takeout: {value: true},
            vegetarian: {value: true},
            vegan: {value: true},
            visa: {value: true},
            wheelchairAccessible: {value: true}
        },
        creator: {_id: 'worgarside@gmail.com', name: {first: 'Will', last: 'Garside'}},
        reviews: ['5aad98377888995220605d11'],
        images: ['2018-03-17 22-34-51.jpg'],
        averageRating: 4
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID['Wagamama']),
        name: 'Wagamama',
        address: {
            line1: '12',
            line2: 'Meadowhall Centre',
            city: 'Sheffield',
            postcode: 'S9 1EP',
            latitude: 53.414766,
            longitude: -1.412663
        },
        contact: {
            url: 'www.wagamama.com/restaurants/sheffield-meadowhall',
            menu: 'www.wagamama.com/our-menu',
            phone: '01142568033'
        },
        openingTimes: [[660, 1320], [660, 1320], [660, 1320], [660, 1320], [660, 1320], [660, 1380], [660, 1380]],
        description: 'Asian-inspired & Japanese chain restaurant where dishes are whisked to long communal tables.',
        priceRange: {lower: 9.85, upper: 14.50, band: 2},
        categories: [
            {name: 'Spicy'}, {name: 'Casual'}, {name: 'Japanese'}, {name: 'Asian'}, {name: 'Contemporary'},
            {name: 'Fusion'}, {name: 'Street Food'}
        ],
        features: {
            alcohol: {value: true},
            americanExpress: {value: true},
            creditCard: {value: true},
            delivery: {value: false},
            highchairs: {value: true},
            glutenFree: {value: true},
            mastercard: {value: true},
            outdoorSeating: {value: false},
            parking: {value: true},
            reservations: {value: false},
            seating: {value: true},
            tableService: {value: true},
            takeout: {value: true},
            vegetarian: {value: true},
            vegan: {value: true},
            visa: {value: true},
            wheelchairAccessible: {value: true},
            wifi: {value: true}
        },
        creator: {_id: 'copeyrufus@gmail.com', name: {first: 'Rufus', last: 'Cope'}},
        images: ['2018-03-25 19-38-00.jpg', '2018-03-25 19-38-01.png']
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID['Siam Thai and Teppanyaki']),
        name: 'Siam Thai and Teppanyaki',
        address: {
            line1: '32',
            line2: 'City Road',
            city: 'Chester',
            postcode: 'CH1 3AE',
            latitude: '53.193437',
            longitude: '-2.881447'
        },
        contact: {
            url: 'www.siam-teppanyaki.co.uk/',
            phone: '01244403222'
        },
        openingTimes: [[720, 1350], [1020, 1380], [720, 1380], [720, 1380], [720, 1380], [720, 1380], [720, 1410]],
        description: 'Airy Asian eatery with Japanese Teppanyaki dining, Thai restaurant and a bar on separate floors.',
        priceRange: {lower: 15.5, upper: 24.95, band: 3},
        categories: [
            {name: 'Japanese'}, {name: 'Chicken'}, {name: 'Sushi'}, {name: 'Thai'}, {name: 'Teppanyaki'}
        ],
        features: {
            alcohol: {value: true},
            americanExpress: {value: true},
            creditCard: {value: true},
            delivery: {value: false},
            highchairs: {value: true},
            glutenFree: {value: true},
            mastercard: {value: true},
            outdoorSeating: {value: false},
            parking: {value: false},
            reservations: {value: true},
            seating: {value: true},
            tableService: {value: true},
            takeout: {value: false},
            vegetarian: {value: true},
            vegan: {value: true},
            visa: {value: true},
            wheelchairAccessible: {value: true},
            wifi: {value: false}
        },
        creator: {_id: 'copeyrufus@gmail.com', name: {first: 'Rufus', last: 'Cope'}},
        reviews: ['5aad98377888995220605d12'],
        images: ['2018-03-20 20-08-00.jpg', '2018-03-20 20-09-01.jpg'],
        averageRating: 5
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID['Handmade Burger Co.']),
        name: 'Handmade Burger Co.',
        address: {
            line1: 'The Old Courthouse, 184',
            line2: 'Deansgate',
            city: 'Manchester',
            postcode: 'M3 3WB',
            latitude: 53.479377,
            longitude: -2.249153
        },
        contact: {
            url: 'www.handmadeburger.co.uk',
            menu: 'www.handmadeburger.co.uk/menu/',
            phone: '01618320708'
        },
        openingTimes: [[720, 1320], [720, 1320], [720, 1320], [720, 1320], [720, 1320], [720, 1380], [720, 1260]],
        description: 'Chain serving specialist burgers on sourdough or brioche buns and hand-mixed milkshakes.',
        priceRange: {lower: 5.45, upper: 10.95, band: 2},
        categories: [
            {name: 'Burgers'}, {name: 'Spicy'}, {name: 'Student Discount'}, {name: 'Casual'}, {name: 'American'},
            {name: 'British'}
        ],
        features: {
            alcohol: {value: true},
            americanExpress: {value: true},
            creditCard: {value: true},
            highchairs: {value: true},
            glutenFree: {value: true},
            mastercard: {value: true},
            parking: {value: false},
            reservations: {value: true},
            seating: {value: true},
            tableService: {value: true},
            takeout: {value: true},
            vegetarian: {value: true},
            vegan: {value: true},
            visa: {value: true},
            wheelchairAccessible: {value: true}
        },
        creator: {_id: 'greta.veronika@gmail.com', name: {first: 'Greta', last: 'Ramaneckaite'}}
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID['Miller & Carter']),
        name: 'Miller & Carter',
        address: {
            line1: '345',
            line2: 'Ecclesall Rd S',
            city: 'Sheffield',
            postcode: 'S11 9PW',
            latitude: 53.3478805,
            longitude: -1.5217238
        },
        contact: {
            url: 'www.millerandcarter.co.uk/',
            menu: 'www.millerandcarter.co.uk/food',
            phone: '01142362735'
        },
        openingTimes: [[690, 1380], [690, 1380], [690, 1380], [690, 1380], [690, 1380], [690, 1380], [690, 1380]],
        priceRange: {lower: 14.95, upper: 46.95, band: 3},
        categories: [{name: 'Premium'}, {name: 'Steakhouse'}],
        features: {
            alcohol: {value: true},
            americanExpress: {value: true},
            creditCard: {value: true},
            delivery: {value: false},
            highchairs: {value: false},
            mastercard: {value: true},
            outdoorSeating: {value: true},
            parking: {value: true},
            reservations: {value: true},
            seating: {value: true},
            tableService: {value: true},
            takeout: {value: false},
            vegetarian: {value: true},
            visa: {value: true},
            wheelchairAccessible: {value: true},
            wifi: {value: true}
        },
        creator: {_id: 'copeyrufus@gmail.com', name: {first: 'Rufus', last: 'Cope'}},
        ownerMessage: "From field to butcher's block to grill, we put everything into the perfect steak. Experience the finest British and Irish cuts at your local restaurant & steakhouse.",
        images: ['2018-03-25 19-24-00.jpg', '2018-03-25 19-24-01.jpg']
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID['Almost Famous']),
        name: 'Almost Famous',
        address: {
            line1: '100-102',
            line2: 'High Street',
            city: 'Manchester',
            postcode: 'M4 1HP',
            latitude: 53.484547,
            longitude: -2.236922
        },
        priceRange: {lower: 9, upper: 12, band: 2},
        contact: {
            url: 'www.almostfamousburgers.com',
            phone: '01612449422'
        },
        openingTimes: [[1020, 1320], [1020, 1320], [1020, 1320], [1020, 1320], [720, 1380], [720, 1380], [720, 1320]],
        categories: [{name: 'Burgers'}, {name: 'Casual'}],
        features: {
            alcohol: {value: true},
            americanExpress: {value: true},
            creditCard: {value: true},
            delivery: {value: true},
            highchairs: {value: true},
            glutenFree: {value: true},
            mastercard: {value: true},
            outdoorSeating: {value: false},
            parking: {value: false},
            reservations: {value: false},
            seating: {value: true},
            tableService: {value: true},
            takeout: {value: true},
            vegetarian: {value: true},
            vegan: {value: true},
            visa: {value: true},
            wheelchairAccessible: {value: true},
            wifi: {value: true}
        },
        creator: {_id: 'greta.veronika@gmail.com', name: {first: 'Greta', last: 'Ramaneckaite'}}
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID['Bungalows & Bears']),
        name: 'Bungalows & Bears',
        address: {
            line1: 'Old Fire Station',
            line2: '50 Division Street',
            city: 'Sheffield',
            postcode: 'S1 4GF',
            latitude: 53.379937,
            longitude: -1.475055
        },
        contact: {
            url: 'www.bungalowsandbears.com',
            menu: 'www.bungalowsandbears.com/food',
            phone: '01142792901'
        },
        openingTimes: [[720, 1440], [720, 1440], [720, 1440], [720, 1440], [720, 90], [720, 90], [660, 1440]],
        priceRange: {lower: 6, upper: 11.5, band: 2},
        categories: [{name: 'Burgers'}, {name: 'Casual'}],
        features: {
            alcohol: {value: true},
            americanExpress: {value: true},
            creditCard: {value: true},
            delivery: {value: false},
            highchairs: {value: false},
            glutenFree: {value: true},
            mastercard: {value: true},
            outdoorSeating: {value: false},
            parking: {value: false},
            reservations: {value: false},
            seating: {value: true},
            tableService: {value: false},
            takeout: {value: false},
            vegetarian: {value: true},
            vegan: {value: false},
            visa: {value: true},
            wheelchairAccessible: {value: true},
            wifi: {value: false}
        },
        creator: {_id: 'copeyrufus@gmail.com', name: {first: 'Rufus', last: 'Cope'}},
        reviews: ['5aad98377888995220605d14'],
        images: ['2018-03-25 20-27-00.jpg', '2018-03-25 20-27-01.jpg', '2018-03-25 20-27-02.jpg'],
        averageRating: 2
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID['Istanbul Restaurant']),
        name: 'Istanbul Restaurant',
        address: {
            line1: '152 - 154',
            line2: 'West Street',
            city: 'Sheffield',
            postcode: 'S1 4ES',
            latitude: 53.380770,
            longitude: -1.477069
        },
        contact: {
            url: 'www.istanbulweststreet.com',
            menu: 'www.istanbulweststreet.com/Menu.html',
            phone: '01142759191'
        },
        openingTimes: [[660, 1410], [660, 1410], [660, 1410], [660, 1410], [660, 1410], [660, 1410], [660, 1410]],
        priceRange: {lower: 7.5, upper: 12, band: 1},
        categories: [{name: 'Mediterranean'}, {name: 'Fast Food'}, {name: 'Turkish'}, {name: 'Late Night Food'}],
        features: {
            alcohol: {value: false},
            americanExpress: {value: false},
            creditCard: {value: true},
            delivery: {value: true},
            highchairs: {value: false},
            glutenFree: {value: false},
            mastercard: {value: true},
            outdoorSeating: {value: false},
            parking: {value: false},
            reservations: {value: true},
            seating: {value: true},
            tableService: {value: false},
            takeout: {value: true},
            vegetarian: {value: true},
            vegan: {value: false},
            visa: {value: true},
            wheelchairAccessible: {value: true},
            wifi: {value: false}
        },
        creator: {_id: 'worgarside@gmail.com', name: {first: 'Will', last: 'Garside'}},
        reviews: ['5aad98377888995220605d15'],
        images: ['2018-03-25 21-03-00.jpg', '2018-03-25 21-03-01.jpg'],
        averageRating: 3
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID['Piccolino']),
        name: 'Piccolino',
        address: {
            line1: '4 Millennium Square',
            city: 'Sheffield',
            postcode: 'S1 2JJ',
            latitude: 53.379483,
            longitude: -1.468791
        },
        contact: {
            url: 'www.individualrestaurants.com/piccolino/sheffield/',
            phone: '01142752698'
        },
        openingTimes: [[720, 1380], [720, 1380], [720, 1380], [720, 1380], [720, 1380], [720, 1380], [720, 1320]],
        description: 'Upscale chain restaurant with a contemporary interior and a menu of classic Italian specialities.',
        priceRange: {lower: 8, upper: 57.75, band: 4},
        categories: [{name: 'Italian'}, {name: 'Premium'}, {name: 'Upscale'}],
        features: {
            alcohol: {value: true},
            americanExpress: {value: true},
            creditCard: {value: true},
            delivery: {value: false},
            highchairs: {value: true},
            glutenFree: {value: true},
            mastercard: {value: true},
            outdoorSeating: {value: true},
            parking: {value: false},
            reservations: {value: true},
            seating: {value: true},
            tableService: {value: true},
            takeout: {value: false},
            vegetarian: {value: true},
            vegan: {value: true},
            visa: {value: true},
            wheelchairAccessible: {value: true},
            wifi: {value: false}
        },
        creator: {_id: 'greta.veronika@gmail.com', name: {first: 'Greta', last: 'Ramaneckaite'}},
        reviews: ['5aad98377888995220605d13'],
        images: ['2018-03-25 21-30-00.jpg', '2018-03-25 21-30-01.jpg', '2018-03-25 21-30-02.jpg'],
        averageRating: 3
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID['Pizza Express']),
        name: 'Pizza Express',
        address: {
            line1: '124 Devonshire Street',
            city: 'Sheffield',
            postcode: 'S3 7SF',
            latitude: 53.379492,
            longitude: -1.477912
        },
        contact: {
            url: 'www.pizzaexpress.com/',
            menu: 'www.pizzaexpress.com/our-food/restaurant-menu',
            phone: '01142752755'
        },
        openingTimes: [[690, 1380], [690, 1380], [690, 1380], [690, 1380], [690, 1380], [690, 1380], [690, 1380]],
        description: 'Chefs in striped t-shirts tossing handmade pizzas where everyone can see.',
        priceRange: {lower: 10.95, upper: 12.95, band: 3},
        categories: [{name: 'Italian'}, {name: 'Premium'}, {name: 'Pizza'}],
        features: {
            alcohol: {value: true},
            americanExpress: {value: true},
            creditCard: {value: true},
            delivery: {value: true},
            highchairs: {value: true},
            glutenFree: {value: true},
            mastercard: {value: true},
            outdoorSeating: {value: false},
            parking: {value: false},
            reservations: {value: true},
            seating: {value: true},
            tableService: {value: true},
            takeout: {value: true},
            vegetarian: {value: true},
            vegan: {value: true},
            visa: {value: true},
            wheelchairAccessible: {value: true},
            wifi: {value: false}
        },
        creator: {_id: 'worgarside@gmail.com', name: {first: 'Will', last: 'Garside'}},
        reviews: ['5aad98377888995220605d17'],
        images: ['2018-03-25 22-55-00.jpg', '2018-03-25 22-55-01.png'],
        averageRating: 4
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID["Las Iguanas"]),
        name: "Las Iguanas",
        address: {
            line1: '8-9 Fitzwilliam Street',
            line2: 'Devonshire Green',
            city: 'Sheffield',
            postcode: 'S1 4JB',
            latitude: 53.379442,
            longitude: -1.480565
        },
        contact: {
            url: 'https://www.iguanas.co.uk',
            menu: 'https://www.iguanas.co.uk/restaurants/sheffield/menus',
            phone: '01142521010'
        },
        openingTimes: [[600, 1410], [600, 1410], [600, 1410], [600, 1410], [600, 1440], [600, 1440], [600, 1410]],
        description: 'Flame-grilled Latin American dishes and shared plates served in a contemporary chain dining room.',
        priceRange: {lower: 8.5, upper: 18.95, band: 2},
        categories: [
            {name: 'Latin American'}, {name: 'Burgers'}, {name: 'Mexican'}, {name: 'Brazilian'}
        ],
        features: {
            alcohol: {value: true},
            americanExpress: {value: true},
            creditCard: {value: true},
            delivery: {value: false},
            highchairs: {value: true},
            glutenFree: {value: true},
            mastercard: {value: true},
            outdoorSeating: {value: false},
            parking: {value: false},
            reservations: {value: true},
            seating: {value: true},
            tableService: {value: true},
            takeout: {value: false},
            vegetarian: {value: true},
            vegan: {value: true},
            visa: {value: true},
            wheelchairAccessible: {value: true}
        },
        creator: {_id: 'greta.veronika@gmail.com', name: {first: 'Greta', last: 'Ramaneckaite'}},
        reviews: ['5aad98377888995220605d18', '5aad98377888995220605d19'],
        images: ['2018-03-26 20-36-00.jpg', '2018-03-26 20-36-01.jpg', '2018-03-26 20-36-02.jpg', '2018-03-26 20-36-03.jpg'],
        averageRating: 3
    }).save());

    insertPromises.push(new Restaurant({
        _id: mongoose.Types.ObjectId(ID["California Fresh"]),
        name: "California Fresh",
        address: {
            line1: '257 Glossop Road',
            city: 'Sheffield',
            postcode: 'S10 2GZ',
            latitude: 53.380101,
            longitude: -1.483646
        },
        contact: {
            url: 'http://www.californiafresh.co.uk/',
            menu: 'http://www.californiafresh.co.uk/menu-1.html',
            phone: '01143272331'
        },
        openingTimes: [[690, 1080], [690, 1080], [690, 1080], [690, 1080], [690, 1080], [], []],
        description: 'Bright, beach-theme room with surfboard-style tables for Mexican and American food made fresh daily.',
        priceRange: {lower: 4.95, upper: 10.75, band: 1},
        categories: [
            {name: 'Burrito'}, {name: 'Mexican'}, {name: 'Salad'}, {name: 'Chipotle'}, {name: 'Barbecue'},
            {name: 'American'}, {name: 'Fast Food'}
        ],
        features: {
            alcohol: {value: false},
            americanExpress: {value: false},
            creditCard: {value: true},
            delivery: {value: false},
            highchairs: {value: false},
            glutenFree: {value: false},
            mastercard: {value: true},
            outdoorSeating: {value: false},
            parking: {value: false},
            reservations: {value: false},
            seating: {value: true},
            tableService: {value: false},
            takeout: {value: true},
            vegetarian: {value: true},
            vegan: {value: true},
            visa: {value: true},
            wheelchairAccessible: {value: true},
            wifi: {value: false}
        },
        creator: {_id: 'copeyrufus@gmail.com', name: {first: 'Rufus', last: 'Cope'}},
        reviews: ['5aad98377888995220605d20'],
        images: ['2018-03-26 20-58-00.jpg', '2018-03-26 20-58-01.jpeg', '2018-03-26 20-58-02.jpg'],
        averageRating: 3
    }).save());
}

/**
 * Populate the 'Reviews' collection of the database with test data
 * @param {Array} insertPromises Array of Model.Save() Promises to be fulfilled before database disconnection
 */
function populateReviews(insertPromises) {
    insertPromises.push(new Review({
        _id: mongoose.Types.ObjectId('5aad98377888995220605d09'),
        restaurantID: ID["Aslan's"],
        title: "Aslan's Sucks",
        body: "I got food poisoning here, don't eat the turkey burgers",
        author: {
            forename: 'Greta',
            surname: 'Ramaneckaite',
            displayImage: 'greta-veronika-gmail-com.jpg',
        },
        images: ['2018-03-17 22-25-18.png', '2018-03-17 22-26-11.png'],
        restaurantRating: 1,
    }).save());

    insertPromises.push(new Review({
        _id: mongoose.Types.ObjectId('5aad98377888995220605d10'),
        restaurantID: ID["Aslan's"],
        title: 'Greatest Kebab of All Time!!!',
        body: `This is, without doubt, the GOAT when it comes to kebabs. Even Adnan's doesn't
         stand up to the might that is ASLAN'S KEBAB HOUSE!!!`,
        author: {
            forename: 'Rufus',
            surname: 'Cope',
            displayImage: 'copeyrufus-gmail-com.jpg',
        },
        images: ['2018-03-17 22-31-42.jpg'],
        restaurantRating: 5,
    }).save());

    insertPromises.push(new Review({
        _id: mongoose.Types.ObjectId('5aad98377888995220605d11'),
        restaurantID: ID['Gourmet Burger Kitchen'],
        title: 'Great burger place, gives me tiny hands',
        body: "The burgers are so big the make my hands feel tiny, phenomenal milkshakes, decent prices - what's not to like?",
        author: {
            forename: 'Will',
            surname: 'Garside',
            displayImage: 'worgarside-gmail-com.jpg',
        },
        images: ['2018-03-17 22-34-51.jpg'],
        restaurantRating: 4
    }).save());

    insertPromises.push(new Review({
        _id: mongoose.Types.ObjectId('5aad98377888995220605d12'),
        restaurantID: ID['Siam Thai and Teppanyaki'],
        title: 'The Teppanyaki is amazing!',
        body: 'I went here for my 15th birthday and even though I had a broken arm at the time, they let me have a go doing the Teppanyaki and were so helpful and friendly',
        author: {
            forename: 'Will',
            surname: 'Garside',
            displayImage: 'worgarside-gmail-com.jpg',
        },
        images: ['2018-03-20 20-08-00.jpg'],
        restaurantRating: 5
    }).save());

    insertPromises.push(new Review({
        _id: mongoose.Types.ObjectId('5aad98377888995220605d13'),
        restaurantID: ID['Piccolino'],
        title: 'Reasonable food at a reasonable price',
        body: `The food is a solid mediocre 7 out of 10. Sometimes the portions are too small, the pizza cheese is a
        bit moist, etc. etc. Also the kitchen appears to be open plan which means that the dining area can be very
        loud! The outdoor seats are great though :)`,
        author: {
            forename: 'Will',
            surname: 'Garside',
            displayImage: 'worgarside-gmail-com.jpg',
        },
        images: ['2018-03-25 21-30-02.jpg'],
        restaurantRating: 3
    }).save());

    insertPromises.push(new Review({
        _id: mongoose.Types.ObjectId('5aad98377888995220605d14'),
        restaurantID: ID['Bungalows & Bears'],
        title: 'Where are the bears?',
        body: `I've been here 3 times now but I've only seen a bear once?? And even then that was when my mom
        showed me a picture on her phone`,
        author: {
            forename: 'Rufus',
            surname: 'Cope',
            displayImage: 'copeyrufus-gmail-com.jpg',
        },
        restaurantRating: 2
    }).save());

    insertPromises.push(new Review({
        _id: mongoose.Types.ObjectId('5aad98377888995220605d15'),
        restaurantID: ID['Istanbul Restaurant'],
        title: 'More of a takeaway!',
        body: 'Title says it all, pretty standard take out food with a nice front',
        author: {
            forename: 'Greta',
            surname: 'Ramaneckaite',
            displayImage: 'greta-veronika-gmail-com.jpg',
        },
        images: ['2018-03-25 21-03-01.jpg'],
        restaurantRating: 3
    }).save());

    insertPromises.push(new Review({
        _id: mongoose.Types.ObjectId('5aad98377888995220605d16'),
        restaurantID: ID["Nando's"],
        title: "Definitely a 'mild' on my spice scale",
        body: `Food is meh, don't understand all the hype. Maybe it's those damn millennials. Also i ate my food
        before i took a picture, but that's what was left`,
        author: {
            forename: 'Rufus',
            surname: 'Cope',
            displayImage: 'copeyrufus-gmail-com.jpg',
        },
        images: ['2018-03-25 21-48-00.jpg'],
        restaurantRating: 2
    }).save());

    insertPromises.push(new Review({
        _id: mongoose.Types.ObjectId('5aad98377888995220605d17'),
        restaurantID: ID["Pizza Express"],
        title: 'Expensive pizza',
        body: 'The pizza is nice but can be quite expensive and the sides are small',
        author: {
            forename: 'Will',
            surname: 'Garside',
            displayImage: 'worgarside-gmail-com.jpg',
        },
        restaurantRating: 4
    }).save());

    insertPromises.push(new Review({
        _id: mongoose.Types.ObjectId('5aad98377888995220605d18'),
        restaurantID: ID["Las Iguanas"],
        title: 'Expensive food',
        body: 'The food was nice, but very expensive. Would only go out on a special occasion to taste some Latin American cuisine',
        author: {
            forename: 'Will',
            surname: 'Garside',
            displayImage: 'worgarside-gmail-com.jpg',
        },
        restaurantRating: 2
    }).save());

    insertPromises.push(new Review({
        _id: mongoose.Types.ObjectId('5aad98377888995220605d19'),
        restaurantID: ID["Las Iguanas"],
        title: 'Amazing drinks!',
        body: 'I have to say that the cocktails made in this restaurant are unbelievably tasty! I drank every last drop. The food was decent, but I was too drunk to care',
        author: {
            forename: 'Rufus',
            surname: 'Cope',
            displayImage: 'copeyrufus-gmail-com.jpg',
        },
        restaurantRating: 5
    }).save());

    insertPromises.push(new Review({
        _id: mongoose.Types.ObjectId('5aad98377888995220605d20'),
        restaurantID: ID["California Fresh"],
        title: 'Dont trust the burrito!',
        body: 'I swear, its delicious, but afterwards you might have regrets from those burritos',
        author: {
            forename: 'Rufus',
            surname: 'Cope',
            displayImage: 'copeyrufus-gmail-com.jpg',
        },
        restaurantRating: 3
    }).save());
}

exports.populateFunction = populateFunction;