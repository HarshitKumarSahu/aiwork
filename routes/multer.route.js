// const multer = require("multer");
// const {v4 : uuidv4} = require("uuid");
// // import { v4 as uuidv4 } from 'uuid';
// const path = require("path");

// const storage = multer.diskStorage({
//     // destination: function (req, file, cb) {
//     //     cb(null, './public/images/uploads')
//     // },
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '..', 'public', 'images', 'uploads'));
//     },    
//     filename: function (req, file, cb) {
//         const unique = uuidv4();
//         cb(null, unique + path.extname(file.originalname));
//     }
// })
  
// const upload = multer({ storage: storage });

// module.exports = upload;

const multer = require("multer");
const { storage } = require("../utils/cloudConfig");

const upload = multer({ storage: storage });

module.exports = upload;