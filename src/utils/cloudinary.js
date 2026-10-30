import { v2 as cloudinary } from 'cloudinary'

// This imports the File System (fs) module, which allows 
// you to work with files and folders on your computer.

import fs from 'fs'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});