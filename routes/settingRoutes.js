const express = require('express');
const router = express.Router();
const settingcontroller = require('../controllers/setting');
const { checkAuth } = require('../middleware/checkAuth');

router.get('/reset', settingcontroller.reset);
router.post('/resetpass', settingcontroller.resetPassword);
router.get("/settings/:username", checkAuth, settingcontroller.setting);
router.get("/reset-data/:username", checkAuth, settingcontroller.resetDetails);
router.post("/resetdata/:username", checkAuth, settingcontroller.resetData);
router.get("/delete/:username", checkAuth, settingcontroller.delete);
router.post("/delete/", checkAuth, settingcontroller.deleteUser);
router.delete("/logout", settingcontroller.logout);

module.exports = router;