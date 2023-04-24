const mongoose = require("mongoose");
const objectid = mongoose.Schema.Types.ObjectId;

const busSchema = new mongoose.Schema({
    BusNumber: {
        type: String,
        required: [true, "Please enter your BusNumber"],
        trim: true,
        unique: false
    },

    School: {
        type: objectid,
        ref: 'school',
        required: [true, "Please enter your School"],
        unique: false
    },
},
    { timestamps: true }
);

busSchema.index({ BusNumber: 1, School: 1 }, { unique: true });

module.exports = mongoose.model("Bus", busSchema);
