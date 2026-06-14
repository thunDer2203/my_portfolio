
import express from "express";
import prisma from "../lib/db.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                             GET SOCIAL LINKS                               */
/* -------------------------------------------------------------------------- */


router.get("/secure",protectRoute, async (req, res) => {
  try {
    const socials = await prisma.socialLink.findMany({
      where:{
        userId:req.user.id,
      },
  });

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

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const socials = await prisma.socialLink.findMany({
      where: {
        user: {
         username: {
        equals: username,
        mode: 'insensitive',
      },
        },
      },
    });

    res.status(200).json({
      success: true,
      socials,
    });
  } catch (error) {
    console.error("GET USER SOCIALS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


router.get("/", async (req, res) => {
  try {
    const socials = await prisma.socialLink.findMany(
      {
        where: {
          userId: 1,
        },
      }
    );

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
/*                         GET SOCIALS BY USERNAME                            */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                             CREATE SOCIAL LINK                             */
/* -------------------------------------------------------------------------- */
router.post("/", protectRoute, async (req, res) => {
  try {
    const { socials } = req.body;

    if (!Array.isArray(socials)) {
      return res.status(400).json({
        success: false,
        message: "socials must be an array",
      });
    }

    const userId = req.user.id;

    await prisma.socialLink.deleteMany({
      where: {
        userId,
      },
    });

    const createdSocials =
      await prisma.socialLink.createMany({
        data: socials.map((social) => ({
          platform: social.platform,
          url: social.url,
          icon: social.icon || null,
          userId,
        })),
      });

    res.status(201).json({
      success: true,
      count: createdSocials.count,
    });
  } catch (error) {
    console.error(
      "CREATE SOCIALS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
