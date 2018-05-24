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
    console.log(`Review:\n    Title: ${req.body.title}\n    Body: ${req.body.body}\n    Files: ${req.files}`);

    const now = dateFormat(new Date(), "yyyy-mm-dd HH-MM-ss");

    const targetDirectory = './public/images/reviewTestImages/';

    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }

    for (let i = 0; i < req.body['imageBlob[]'].length; i++) {
        let image = req.body['imageBlob[]'][i];

        // strip off the data: url prefix to get just the base64-encoded bytes
        let imageBlob = image.replace(/^data:image\/\w+;base64,/, '');
        let buf = new Buffer(imageBlob, 'base64');
        fs.writeFile(`${targetDirectory}${now}_${i}.png`, buf, (err) => {
            if (err) throw err;
            // console.log('The file has been saved!');
        });
    }

    res.send('done');
});

module.exports = router;