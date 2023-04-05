const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");


router.post("/login", driverController.login);
router.post("/forgotPassword", driverController.forgotPassword);
router.patch("/resetPassword/:token", driverController.resetPassword);
router.patch("/update", driverController.updateFunction);
router.get("/getAllStudents", driverController.getAllStudents);

module.exports = router;