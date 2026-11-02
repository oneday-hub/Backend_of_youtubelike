import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

export const upload = multer({ 
    storage

});    

// Multer configuration for your VideoTube backend. Let's 
// understand exactly what your code is doing, line by line.

// In simple words, you're telling Multer:
// When a user uploads a file, save it on my server's disk inside 
// public/temp, and use the file's original name.