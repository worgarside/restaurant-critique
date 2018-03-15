var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDlmGXTAyXPQy1GX02s8UDm1OLBNz6zia0'
});

googleMapsClient.geocode({
    address: 'SY4 5PP'
}, function(err, response) {
    if (!err) {
        console.log(response.json.results[0].geometry.location);
    }
});