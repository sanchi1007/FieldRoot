const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { logSecurityEvent } = require('./security');

// Ensure destination directory exists
const uploadDirectory = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Allowed extensions & mimetypes
const MIME_EXTENSION_MAP = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
};

// Storage configuration with cryptographically secure random filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const ext = MIME_EXTENSION_MAP[file.mimetype] || '.jpg';
    const randomHex = crypto.randomBytes(16).toString('hex');
    cb(null, `herb-${randomHex}${ext}`);
  }
});

// File filter (accept only valid image mimetypes and safe extensions)
const fileFilter = (req, file, cb) => {
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  // Reject double extensions or null-byte injections
  if (file.originalname.includes('\0') || !allowedExts.includes(ext) || !MIME_EXTENSION_MAP[file.mimetype]) {
    logSecurityEvent('SUSPICIOUS_FILE_UPLOAD_BLOCKED', `Filename: ${file.originalname}, MIME: ${file.mimetype}`, req);
    return cb(new Error('Invalid file type. Only JPG, PNG, and WEBP image formats are allowed!'), false);
  }

  cb(null, true);
};

// Multer upload instance: max 4 images, 5MB each
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 4
  },
  fileFilter: fileFilter
});

module.exports = upload;
