import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer guarda el archivo en memoria (buffer), no en disco
export const upload = multer({ storage: multer.memoryStorage() });

// Sube un buffer a Cloudinary y devuelve la URL
export const uploadToCloudinary = (buffer, folder = "portfolio") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [{ width: 1920, crop: "limit", quality: "auto:good" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
};

export { cloudinary };
