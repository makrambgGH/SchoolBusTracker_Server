const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const objectid = mongoose.Schema.Types.ObjectId; // for referance in mongoDB

const schoolSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        required: [true, "Please enter your BusNumber"],
        unique: true,
        trim: true
    },

    password: {
        type: String,
        trim: true,
        minLength: 8,
    },

    phoneNumber: {
        type: String,
        minLength: 8,
        trim: true
    },


    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
    { timestamps: true }
);

// Automated function 

schoolSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 12);
    } catch (err) {
        console.log(err);
    }
});



schoolSchema.methods.checkPassword = async function (
    plainPassword,
    hashedPassword
) {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

schoolSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");


    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
module.exports = mongoose.model("school", schoolSchema);




