const express = require("express");
const router = express.Router();
const schoolController = require("../Controllers/schoolController");
const studentController = require("../Controllers/studentController");
const driverController = require("../Controllers/driverController");

router.post("/signup", schoolController.signUp);
router.post("/login", schoolController.login);
router.patch("/resetPassword", schoolController.resetPassword);
router.post("/addStudent", studentController.signUp);
router.post("/addDriver", driverController.signUp);
router.delete("/removeStudent", schoolController.removeStudent);
router.delete("/removeDriver", schoolController.removeDriver);
router.post("/createBus", schoolController.createBus);
router.delete("/deleteBus", schoolController.deleteBus);
router.get("/getAllStudents", schoolController.getAllStudents);
router.get("/getAllDrivers", schoolController.getAllDrivers);
router.get("/getAllBusses", schoolController.getAllBusses);
module.exports = router;