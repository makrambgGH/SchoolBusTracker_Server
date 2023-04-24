const Student = require("../models/studentModel");
const School = require("../models/schoolModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/email").sendMail;
const crypto = require("crypto");
const Bus = require("../models/busModel");

exports.login = async (req, res) => {
    try {
        const student = await Student.findOne({ userName: req.body.userName });

        if (!student) {
            return res.status(404).json({ message: "The student does not exist" });
        }

        if (!(await student.checkPassword(req.body.password, student.password))) {
            return res.status(401).json({ message: "Incorrect username or password" });
        }
        return res.status(200).json({ message: "You are logged in successfully !!" });
    } catch (err) {
        console.log(err);
    }
};

exports.signUp = async (req, res) => {
    try {

        let email = req.body.email;

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email." });
        }

        const school = await School.findOne({ schoolName: req.body.schoolName })
        if (!school) {
            return res.status(400).json({ message: "School doesn't exist" })
        }

        const checkUsername = await Student.findOne({ userName: req.body.userName });
        if (checkUsername) {
            return res.status(409).json({ message: "userName already in use." });
        }

        let pass = req.body.password;
        if (!pass) {
            return res
                .status(400)
                .json({ message: "Password is required." });
        }

        let busNumber = req.body.busNumber;
        if (!busNumber) {
            return res
                .status(400)
                .json({ message: "busNumber is required." });
        }

        const bus = await Bus.findOne({ BusNumber: busNumber, School: school._id });

        if (!bus) {
            return res.status(400).json({ message: "bus does not exist." });
        }

        const newstudent = await Student.create({
            fullName: req.body.fullName,
            userName: req.body.userName,
            email: req.body.email,
            password: pass,
            Bus: bus._id,
        });

        return res
            .status(201)
            .json({ message: "Student created successfully.", data: { newstudent } });


    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



exports.forgotPassword = async (req, res) => {
    try {

        const student = await Student.findOne({ email: req.body.email })
        if (!student) {
            return res.status(404).json({ message: "The user with the provided email does not exist ." })
        }

        const resetToken = student.generatePasswordResetToken();
        await student.save({ validateBeforeSave: false });

        const url = `${req.protocol}://${req.get("host")}/student/resetPassword/${resetToken}`;
        const msg = `Forgot your password ? Reset it by visiting the following link : ${url}`;
        try {
            await sendMail({
                email: student.email,
                subject: "Your password reset token : (valid for 10min)",
                message: msg
            });
            res.status(200).json({ status: "success", message: "The reset link was delivers to your email" });
        } catch (err) {
            console.error(err);
            student.passwordResetToken = undefined;
            student.passwordResetExpires = undefined;
            await student.save({ validateBeforeSave: false });

            res.status(500).json({ message: "An error occured while sending email, please try again in moment" });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const student = await Student.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
        if (!student) {
            return res.status(400).json({
                message: "The token is invalid, or expired. please request a new one",
            });
        }

        if (req.body.password.length < 8) {
            return res.status(400).json({ message: "Password length is too short" })
        }

        if (req.body.password !== req.body.passwordConfirm) {
            return res.status(400).json({ message: "Password & Password Confirm are not the same" });
        }

        student.password = req.body.password;
        student.passwordConfirm = req.body.passwordConfirm;
        student.passwordResetToken = undefined;
        student.passwordResetChangeAt = Date.now();

        await student.save();
        return res.status(200).json({ message: "password changed successfully" });
    } catch (err) {
        console.log(err);
    }
}

exports.updateFunction = async (req, res) => {
    const student = await Student.findOne({ userName: req.body.userName });
    if (!student) {
        return res.status(400).json({
            message: "The student is not found ",
        });
    }

    const allowedChange = ["fullName", "phoneNumber", "email"];
    for (let i = 0; i < allowedChange.length; i++) {
        let change = allowedChange[i];
        if (req.body[change]) {
            student[change] = req.body[change];
        }
    }
    await student.save();
    return res.status(200).json({ message: "your info updated successfully" });
}

exports.uploadProfile = async function (req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "please upload a valid image" });
        }
        if (!req.body.userName) {
            return res.status(400).json({ message: "please enter username" });
        }
        await Student.findOneAndUpdate({ userName: req.body.userName }, { $set: { profilePicture: (new URL(req.file.path)).toString() } });
        return res.status(200).json({ message: "saved" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}