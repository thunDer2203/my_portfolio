import { resumeUpload } from "../middleware/resumeUpload.js";
import express from "express";
import prisma from "../lib/db.js";


const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                               GET RESUME                                */
/* -------------------------------------------------------------------------- */

router.get("/download", async (req, res) => {
  try {
    const resume = await prisma.resume.findFirst();

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.redirect(resume.fileUrl);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
});

router.post(
  "/upload",
  resumeUpload.single("resume"),
  async (req, res) => {
    try {
      const existing = await prisma.resume.findFirst();
      const { title } = req.body;
      if (existing) {
        await prisma.resume.update({
          where: {
            id: existing.id,
          },
          data: {
            title: title || existing.title,
            fileUrl: req.file.path,
          },
        });
      } else {
        await prisma.resume.create({
          data: {
            title: title || "My Resume",
            fileUrl: req.file.path,
          },
        });
      }

      res.status(200).json({
        success: true,
        url: req.file.path,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
      });
    }
  }
);

export default router;