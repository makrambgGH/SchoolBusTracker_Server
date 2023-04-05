const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const objectid = mongoose.Schema.Types.ObjectId; // for referance in mongoDB

const driverSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please enter your fullName"],
        trim: true
    },

    userName: {
        type: String,
        required: [true, "Please enter your UserName"],
        unique: true,
        trim: true
    },

    phoneNumber: {
        type: String,
        minLength: 8,
        trim: true
    },

    Bus: {
        type: objectid,
        ref: 'Bus',
        required: [true, "Please enter your BusNumber"],
    },

    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        lowercase: true
    },

    profilePic: {
        type: String
    },

    password: {
        type: String,
        required: [true, "Please enter your password"],
        trim: true,
        minLength: 8,
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
    { timestamps: true }
);



driverSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
    } catch (err) {
        console.log(err);
    }
});



driverSchema.methods.checkPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

driverSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");


    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
module.exports = mongoose.model("driver", driverSchema);