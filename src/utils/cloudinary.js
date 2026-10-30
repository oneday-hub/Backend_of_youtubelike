import { v2 as cloudinary } from 'cloudinary'
import { count } from 'console';

// This imports the File System (fs) module, which allows 
// you to work with files and folders on your computer.

import fs from 'fs'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if(!localFilePath) return null
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type: "auto"
    })

    // file has been uploaded successfully
    console.log("file uploaded to cloudinary successfully ", response.url);

    return response.url

  }catch (error) {
    fs.unlinkSync(localFilePath) 
    // remove the locally saved temporary file as the upload operation got failed
    return null
  }
}

export {uploadOnCloudinary}