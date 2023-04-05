const Bus = require("../models/busModel");
const Student = require("../models/studentModel");

exports.createBus = async function (busNumber, schoolId) {
    await Bus.create({
        BusNumber: busNumber,
        School: schoolId
    })
}

exports.GetBusStudents = async function (busNumber) {
    const bus = await Bus.findOne({
        BusNumber: busNumber,
    })
    if (!bus) {
        return [];
    } else {
        const studentList = await Student.find({ Bus: bus._id });
        return studentList;
    }
}

exports.deleteBus = async function (busNumber) {
    await Bus.deleteOne({ BusNumber: busNumber })
}
