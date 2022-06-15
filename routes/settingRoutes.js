const express = require('express');
const router = express.Router();
const settingcontroller = require('../controllers/setting');

router.get('/reset', settingcontroller.reset);
router.post('/resetpass', settingcontroller.resetPassword);
router.get("/settings/:username", settingcontroller.setting);

router.get("/reset-data/:username", settingcontroller.resetDetails);

router.post("/resetdata/:username", settingcontroller.resetData);

router.get("/delete/:username", settingcontroller.delete);
router.post("/delete/", settingcontroller.deleteUser);


module.exports = router;