import express from "express";
import prisma from "../lib/db.js";

const router = express.Router();

/* ---------------- GET ABOUT ---------------- */

router.get("/", async (req, res) => {
  try {
    const about = await prisma.about.findFirst();

    res.status(200).json({
      success: true,
      about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch about section",
    });
  }
});

/* ---------------- CREATE / UPDATE ABOUT ---------------- */

router.post("/", async (req, res) => {
  try {
    const { heading, content } = req.body;

    const existing = await prisma.about.findFirst();

    let about;

    if (existing) {
      about = await prisma.about.update({
        where: {
          id: existing.id,
        },
        data: {
          heading,
          content,
        },
      });
    } else {
      about = await prisma.about.create({
        data: {
          heading,
          content,
        },
      });
    }

    res.status(200).json({
      success: true,
      about,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save about section",
    });
  }
});

export default router;