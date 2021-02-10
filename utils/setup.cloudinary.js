const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api_Key,
  api_secret: process.env.Cloud_Secret
});

exports.uploads = (file, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, options, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results)
    })
  })
};