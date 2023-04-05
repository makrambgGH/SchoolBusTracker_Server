const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const objectid = mongoose.Schema.Types.ObjectId; // for referance in mongoDB

const StudentSchema = new mongoose.Schema({
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

    email: {
        type: String,
        trim: true,
        lowercase: true,
    },

    Bus: {
        type: objectid,
        ref: 'Bus',
        required: [true, "Please enter your BusNumber"],
    },

    password: {
        type: String,
        required: [true, "Please enter your password"],
        trim: true,
        minLength: 8,
    },

    profilePicture: {
        type: String
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
    { timestamps: true }
);

// Automated function 

StudentSchema.pre("save", async function (next) {
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



StudentSchema.methods.checkPassword = async function (
    candidatePassword,
    userPassword
) {
    if (!candidatePassword || !userPassword) {
        console.log(candidatePassword);
        return false;
    }
    return await bcrypt.compare(candidatePassword, userPassword);
};

StudentSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");


    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
module.exports = mongoose.model("student", StudentSchema);