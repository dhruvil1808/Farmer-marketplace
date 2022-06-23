const express = require('express');
const router = express.Router();
const homecontroller = require('../controllers/home');
const usercontroller = require('../controllers/user');
const cropcontroller = require('../controllers/crop');
const { upload } = require('../middleware/multer');
const passport = require('passport');
const { checkAuth, checkNotAuth } = require('../middleware/checkAuth');

router.get('/', checkNotAuth, homecontroller.index);
router.get('/sign-up/:value', checkNotAuth, homecontroller.signup);
router.get('/signin', checkNotAuth, homecontroller.signin);
router.post('/signin', passport.authenticate('local', { successRedirect: '/login', failureRedirect: '/signin', failureFlash: true }));
router.get('/about', checkNotAuth, homecontroller.about);
router.get('/search', checkNotAuth, homecontroller.search);

router.post('/createbuyer', checkNotAuth, usercontroller.createBuyer);
router.post('/createseller', checkNotAuth, usercontroller.createSeller);
router.get('/login', checkAuth, usercontroller.login);

router.post('/post-crop', checkAuth, upload.single('crop_image'), cropcontroller.postCrop);
router.post('/buy-crop/:id', checkAuth, cropcontroller.buyCrop);
router.get('/buy-search', checkAuth, cropcontroller.buySearch);
router.get('/sell-search', checkAuth, cropcontroller.sellSearch);

router.get('/bids/:id', checkNotAuth, cropcontroller.bids);
router.get('/sellerbids/:id', checkAuth, cropcontroller.bidsForSeller);
router.get('/buyerbids/:id', checkAuth, cropcontroller.bidsForBuyer);
module.exports = router;