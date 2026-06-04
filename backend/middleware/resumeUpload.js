import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "portfolio/resume",
    resource_type: "raw",
    format: "pdf",
    public_id: `resume-${Date.now()}`,
  }),
});

export const resumeUpload = multer({
  storage: resumeStorage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  },

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});