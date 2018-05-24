/**
 * Routing file for new Review upload on restaurant page
 * Management of inserting new Review to the database and rerouting back to the page with review displayed
 * @author Greta Ramaneckaite, Rufus Cope
 */

// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const dateFormat = require('dateformat');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/reviewTestImages');
    },
    filename: (req, file, callback) => {
        const re = /(?:\.([^.]+))?$/;
        const extension = `.${re.exec(file.originalname)[1]}`;
        const filename = crypto.randomBytes(20).toString('hex');
        callback(null, filename + extension);
    }
});

const upload = multer({storage: storage});

router.use(bodyParser.urlencoded({extended: true}));

// ================ POST Method ================ \\

// router.post('/upload_picture', upload.array('images', 5), (req, res) => {
router.post('/submit_review', (req, res) => {
    console.log(`Review:
    Title: ${req.body.title}
    Rating: ${req.body.rating}
    Body: ${req.body.body}
    Restaurant: ${req.body.restaurantId}
    User: ${req.user._id}
    imageBlob.length: ${req.body['imageBlob[]'].length}
    `);

    processImages(req.body['imageBlob[]'], req.body.restaurantId);

    res.send('done');
});

// TODO jsdoc
function processImages(imageArray, restaurantId) {
    const now = dateFormat(new Date(), 'yyyy-mm-dd HH-MM-ss');
    const targetDirectory = `./public/images/reviewTest/${restaurantId}/`;

    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }

    for (let i = 0; i < imageArray.length-1; i++) {
        let image = imageArray[i];
        // strip off the data: url prefix to get just the base64-encoded bytes
        let imageBlob = image.replace(/^data:image\/\w+;base64,/, '');
        let buf = new Buffer(imageBlob, 'base64');
        fs.writeFile(`${targetDirectory}${now}_${i}.png`, buf, (err) => {
            if (err) throw err;
        });
    }

}

module.exports = router;