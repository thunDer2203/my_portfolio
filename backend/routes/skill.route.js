
import express from "express";
import prisma from "../lib/db.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                               GET ALL SKILLS                               */
/* -------------------------------------------------------------------------- */

router.get("/", async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: {
        userId: 1,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    console.error("GET SKILLS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                                CREATE SKILL                                */
/* -------------------------------------------------------------------------- */

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
      try {
          const {
              name,
              description,
              category,
              level,
            } = req.body;
            
            const skill = await prisma.skill.create({
                data: {
                    name,
          description,
          category,
          level: Number(level),

          icon: req.file?.path || null,
        },
    });
    
    res.status(201).json({
        success: true,
        skill,
    });
    
    } catch (error) {
      console.error("Error in skill section",error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);



/* -------------------------------------------------------------------------- */
/*                         GET SKILLS BY USERNAME                             */
/* -------------------------------------------------------------------------- */

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const skills = await prisma.skill.findMany({
      where: {
        user: {
          username: {
        equals: username,
        mode: 'insensitive',
      },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    console.error("GET USER SKILLS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                                DELETE SKILL                                */
/* -------------------------------------------------------------------------- */

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    await prisma.skill.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Skill deleted",
    });
  } catch (error) {
    console.error("DELETE SKILL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
