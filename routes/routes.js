const express = require('express');
const router = express.Router();
const homecontroller = require('../controllers/home');
const usercontroller = require('../controllers/user');
const cropcontroller = require('../controllers/crop');
const settingcontroller = require('../controllers/setting');
const { upload } = require('../middleware/multer');

router.get('/', homecontroller.index);
router.get('/sign-up/:value', homecontroller.signup);
router.get('/signin', homecontroller.signin);
router.get('/about', homecontroller.about);

router.post('/createbuyer', usercontroller.createBuyer);
router.post('/createseller', usercontroller.createSeller);
router.get('/login/', usercontroller.login);

router.get('/reset', settingcontroller.reset);
router.post('/resetpass', settingcontroller.resetPassword);

router.post('/post-crop/:farmername', upload.single('crop_image'), cropcontroller.postCrop);
router.post('/buy-crop/:id/:name', cropcontroller.buyCrop);

router.use((req, res) => {
    res.render('404.ejs', { title: '404 Error hai', alrt: '' });
}
);
module.exports = router;