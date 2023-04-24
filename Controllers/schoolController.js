const School = require("../models/schoolModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/email").sendMail;
const crypto = require("crypto");
const Student = require("../models/studentModel");
const Driver = require("../models/driverModel");
const busController = require("./busController");
const Bus = require("../models/busModel");

exports.login = async (req, res) => {
    try {
        const school = await School.findOne({ schoolName: req.body.schoolName });
        if (!school) {
            return res.status(404).json({ message: "The school does not exist" });
        }
        console.log(school.password);
        if (!(await school.checkPassword(req.body.password, school.password))) {
            return res.status(401).json({ message: "Incorrect schoolName or password" });
        }

        return res.status(200).json({ message: "You are logged in successfully !!" });
    } catch (err) {
        console.log(err);
    }
};

exports.signUp = async (req, res) => {
    try {
        const schoolName = req.body.schoolName;
        if (!schoolName) {
            return res
                .status(400)
                .json({ message: "The school Name is required." });
        }
        let pass = req.body.password;
        if (!pass) {
            return res
                .status(400)
                .json({ message: "The password is required." });
        }

        const newSchool = await School.create({
            schoolName: req.body.schoolName,
            phoneNumber: req.body.phoneNumber,
            password: pass,
        });
        return res
            .status(201)
            .json({ message: "School created successfully.", data: { newSchool } });


    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const school = await School.findOne({ schoolName: req.body.schoolName });

        if (!school) {
            return res.status(404).json({ message: "The school does not exist" });
        }

        if (req.body.password.length < 8) {
            return res.status(400).json({ message: "Password length is too short" })
        }

        school.password = req.body.password;

        await school.save();
        return res.status(200).json({ message: "password changed successfully" });
    } catch (err) {
        console.log(err);
    }
}

exports.removeStudent = async (req, res) => {
    try {
        const student = await Student.findOneAndRemove({ userName: req.body.userName });
        if (!student) {
            return res.status(400).json({ message: "The student doesn't exist" });
        }
        res.status(200).json({ message: "The selected student is removed" });
    } catch {
        res.status(400).json({ message: "error, cannot remove this student" });
    }
}

exports.removeDriver = async (req, res) => {
    try {
        const driver = await Driver.findOneAndRemove({ userName: req.body.userName });
        if (!driver) {
            return res.status(400).json({ message: "The driver doesn't exist" });
        }
        res.status(200).json({ message: "The selected driver is removed" });
    } catch {
        res.status(400).json({ message: "error, cannot remove this Driver" });
    }
}

exports.createBus = async function (req, res) {
    try {
        const school = await School.findOne({ schoolName: req.body.schoolName })
        if (!school) {
            return res.status(400).json({ message: "School doesn't exist" })
        }
        await busController.createBus(req.body.busNumber, school._id);
        return res.status(200).json({ message: "Created bus succesfully" })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Can't create bus" })
    }
}

exports.deleteBus = async function (req, res) {
    try {
        const school = await School.findOne({ schoolName: req.body.schoolName })
        if (!school) {
            return res.status(400).json({ message: "School doesn't exist" })
        }
        await busController.deleteBus(req.body.busNumber, school._id);
        return res.status(200).json({ message: "Deleted bus succesfully" })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Can't delete bus" })
    }
}

exports.getAllStudents = async function (req, res) {
    if (!req.body.schoolName) {
        return res.status(400).json({ message: "schoolName is required" });
    }
    const school = await School.findOne({ schoolName: req.body.schoolName });
    if (!school) {
        return res.status(400).json({ message: "School is not found" });
    }
    const allBusses = await Bus.find({ School: school._id });
    const allStudent = (await Promise.all(
        allBusses.map(async (bus) => await Student.find({ Bus: bus._id }))
    )).flat();
    return res.status(200).json({ message: "Got students succesfully", data: allStudent });
}

exports.getAllDrivers = async function (req, res) {
    if (!req.body.schoolName) {
        return res.status(400).json({ message: "schoolName is required" });
    }
    const school = await School.findOne({ schoolName: req.body.schoolName });
    if (!school) {
        return res.status(400).json({ message: "School is not found" });
    }
    const allBusses = await Bus.find({ School: school._id });
    const allDriver = (await Promise.all(
        allBusses.map(async (bus) => await Driver.find({ Bus: bus._id }))
    )).flat();
    return res.status(200).json({ message: "Got drivers succesfully", data: allDriver });
}

exports.getAllBusses = async function (req, res) {
    if (!req.body.schoolName) {
        return res.status(400).json({ message: "schoolName is required" });
    }
    const school = await School.findOne({ schoolName: req.body.schoolName });
    if (!school) {
        return res.status(400).json({ message: "School is not found" });
    }
    const allBusses = await Bus.find({ School: school._id });
    return res.status(200).json({ message: "Got busses succesfully", data: allBusses });
}