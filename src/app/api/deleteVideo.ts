// pages/api/deleteVideo.js
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async (req, res) => {
  const publicId = req.body.publicId;

  await cloudinary.v2.uploader
    .destroy(publicId, { resource_type: "video" }, function (error, result) {
      if (result) {
        res.status(200).json("Video Deleted");
      }
    })
    .catch((e) => {
      console.error(e);
    });
};
