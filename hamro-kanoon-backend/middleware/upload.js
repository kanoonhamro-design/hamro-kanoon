const multer = require('multer');
const { storage } = require('../config/cloudinary');

// File format filter garne (Image aur PDF matra allow garne)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP images and PDF documents are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Maximum 10MB ko file limit
  }
});

module.exports = upload;