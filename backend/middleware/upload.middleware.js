import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "portfolio",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
    transformation: [
      {
        quality: "auto",
      },
    ],
  }),
});

export const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed"));
    }

    cb(null, true);
  },
});