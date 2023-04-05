const express = require("express");
const router = express.Router();
const upload = require("../utils/uploadImage").upload;
const driverController = require("../Controllers/driverController");
const studentController = require("../Controllers/studentController");

router.post("/driverProfile", upload.single("profilePic"), driverController.uploadProfile);
router.post("/studentProfile", upload.single("profilePic"), studentController.uploadProfile);

module.exports = router;