const mongoose = require("mongoose");
const objectid = mongoose.Schema.Types.ObjectId;

const busSchema = new mongoose.Schema({
    BusNumber: {
        type: String,
        required: [true, "Please enter your BusNumber"],
        unique: true,
        trim: true
    },

    School: {
        type: objectid,
        ref: 'school',
        required: [true, "Please enter your School"],
    },
},
    { timestamps: true }
);
module.exports = mongoose.model("Bus", busSchema);
