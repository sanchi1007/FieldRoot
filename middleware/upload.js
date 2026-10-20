const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure destination directory exists
const uploadDirectory = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'herb-' + uniqueSuffix + ext);
  }
});

// File filter (accept only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, WEBP) are allowed!'));
  }
};

// Multer upload instance: max 4 images, 5MB each
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter: fileFilter
});

module.exports = upload;
