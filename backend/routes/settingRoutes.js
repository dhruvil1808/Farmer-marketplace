const express = require('express');
const router = express.Router();
const settingcontroller = require('../controllers/setting');
const { checkAuth } = require('../middleware/checkAuth');

router.get('/reset', settingcontroller.reset);
router.post('/resetpass', settingcontroller.resetPassword);
router.get("/settings", checkAuth, settingcontroller.setting);
router.get("/reset-data", checkAuth, settingcontroller.resetDetails);
router.post("/resetdata", checkAuth, settingcontroller.resetData);
router.get("/delete", checkAuth, settingcontroller.delete);
router.post("/delete/", checkAuth, settingcontroller.deleteUser);
router.delete("/logout", settingcontroller.logout);

module.exports = router;