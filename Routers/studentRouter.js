const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/studentController");


router.post("/login", studentController.login);
router.post("/forgotPassword", studentController.forgotPassword);
router.patch("/resetPassword/:token", studentController.resetPassword);
router.patch("/update", studentController.updateFunction);

module.exports = router;