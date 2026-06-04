
import express from "express";
import prisma from "../lib/db.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                             GET SOCIAL LINKS                               */
/* -------------------------------------------------------------------------- */

router.get("/", async (req, res) => {
  try {
    const socials = await prisma.socialLink.findMany();

    res.status(200).json({
      success: true,
      socials,
    });
  } catch (error) {
    console.error("GET SOCIALS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                             CREATE SOCIAL LINK                             */
/* -------------------------------------------------------------------------- */

router.post("/", protectRoute,upload.single("icon"), async (req, res) => {
  try {
    const { platform, url } = req.body;

    const social = await prisma.socialLink.create({
      data: {
        platform,
        url,
        icon: req.file?.path || null,
      },
    });

    res.status(201).json({
      success: true,
      social,
    });
  } catch (error) {
    console.error("CREATE SOCIAL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
