const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

// 1. Cloudinary Account Connect Garne
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Storage Engine Banaune (PDF aur Images ko lagi)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Check garne user le PDF upload gardai cha ki Photo
    let folderName = 'hamro_kanoon_images';
    let resourceType = 'image';

    if (file.mimetype === 'application/pdf') {
      folderName = 'hamro_kanoon_pdfs';
      resourceType = 'raw'; // Cloudinary ma PDF lai 'raw' wa 'auto' treat garincha
    }

    return {
      folder: folderName,
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // Unique name dine
    };
  },
});

module.exports = { cloudinary, storage };