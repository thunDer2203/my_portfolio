import express from "express";
import prisma from "../lib/db.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


/* ---------------- GET ABOUT BY USERNAME ---------------- */



router.get("/secure", protectRoute, async (req, res) => {
  try {
    const about = await prisma.about.findFirst({
      where:{
        userId: req.user.id,
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

router.post("/", protectRoute, async (req, res) => {
  try {
    const { heading, content } = req.body;

    const userId = req.user.id;

    await prisma.about.deleteMany({
      where: {
        userId,
      },
    });

    const about = await prisma.about.create({
      data: {
        heading,
        content,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      about,
    });
  } catch (error) {
    console.error(
      "CREATE ABOUT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;