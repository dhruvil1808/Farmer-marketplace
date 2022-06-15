const express = require('express');
const router = express.Router();
const homecontroller = require('../controllers/home');
const usercontroller = require('../controllers/user');
const cropcontroller = require('../controllers/crop');
const { upload } = require('../middleware/multer');

router.get('/', homecontroller.index);
router.get('/sign-up/:value', homecontroller.signup);
router.get('/signin', homecontroller.signin);
router.get('/about', homecontroller.about);
router.get('/search', homecontroller.search);

router.post('/createbuyer', usercontroller.createBuyer);
router.post('/createseller', usercontroller.createSeller);
router.get('/login/', usercontroller.login);

router.post('/post-crop/:farmername', upload.single('crop_image'), cropcontroller.postCrop);
router.post('/buy-crop/:id/:name', cropcontroller.buyCrop);
router.get('/buy-search/:name', cropcontroller.buySearch);
router.get('/sell-search/:name', cropcontroller.sellSearch);

module.exports = router;