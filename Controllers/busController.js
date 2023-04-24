const Bus = require("../models/busModel");
const Student = require("../models/studentModel");

exports.createBus = async function (busNumber, schoolId) {
    await Bus.create({
        BusNumber: busNumber,
        School: schoolId
    })
}

exports.GetBusStudents = async function (busId) {
    const studentList = await Student.find({ Bus: busId });
    return studentList;
}

exports.deleteBus = async function (busNumber, SchoolId) {
    await Bus.deleteOne({ BusNumber: busNumber, School: SchoolId })
}
