const multer = require("multer");
const path = require("path");

// Configure file upload
const storage = multer.memoryStorage(); // Store file in memory buffer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    console.log("ext", file);

    if (ext !== ".xlsx" && ext !== ".csv") {
      return cb(
        new Error("Only Excel (.xlsx) or CSV files are allowed"),
        false
      );
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;
