import express from "express";
import prisma from "../lib/db.js";

const router = express.Router();


/* ---------------- GET ABOUT BY USERNAME ---------------- */

router.get("/:username", async (req, res) => {
  try {

    // console.log("Fetching about for username:", req.params.username);
    const { username } = req.params;

    const about = await prisma.about.findFirst({
  where: {
    user: {
      username: {
        equals: username,
        mode: 'insensitive',
      },
    },
  },
});

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }
    
    // console.log("Found about for username:", about);
    res.status(200).json({
      success: true,
      about,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch about section",
    });
  }
});

/* ---------------- GET ABOUT ---------------- */

router.get("/", async (req, res) => {
  try {
    const about = await prisma.about.findFirst({
      where:{
        userId:1,
      },
    });

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