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

router.post('/add_review', upload.array('images', 10), (req, res) => {
    console.log(`Review:\n    Title: ${req.body.title}\n    Body: ${req.body.body}\n    Files: ${req.files}`);
    res.redirect('back');
});

router.post('/upload_picture', (req, res) => {

    const userId = req.body.userId;
    console.log(`userId: ${userId}`);
    const newString = new Date().getTime();
    const targetDirectory = `./public/images/reviewTestImages/`;

    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }

    console.log(`Saving file ${targetDirectory}${newString}`);

    // strip off the data: url prefix to get just the base64-encoded bytes
    let imageBlob = req.body.imageBlob.replace(/^data:image\/\w+;base64,/, "");
    let buf = new Buffer(imageBlob, 'base64');
    fs.writeFile(targetDirectory + newString + '.png', buf, function(err) {
        if(err) {
            return console.log(err);
        }else{
            console.log("The file was saved!");}
    });

    let filePath = targetDirectory + newString;
    let data = {
        user: userId,
        filePath: filePath
    };
    res.end(JSON.stringify({data: ''}));
});

module.exports = router;