const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "D:/Users/ccss/Desktop/Temp");
    },
    filename: (req, file, cb) => {
        cb(null, "Pic" + "-" + Date.now() + path.extname(file.originalname));
    },
})
const fileFilter = (req, file, cb) => {
    const types = ['image/png', 'image/jpg', 'image/jpeg'];
    if (types.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: fileFilter,
})