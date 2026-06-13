
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


router.get("/secure", protectRoute, async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: {
        userId: req.user.id,
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
//need to make an option in frontend to choose from added icons or upload new one
router.post("/", protectRoute, async (req, res) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: "skills must be an array",
      });
    }

    const userId = req.user.id;

    // Remove existing skills
    await prisma.skill.deleteMany({
      where: {
        userId,
      },
    });

    // Create new skills
    const createdSkills =
      await prisma.skill.createMany({
        data: skills.map((skill) => ({
          name: skill.name,
          description:
            skill.description || null,
          category: skill.category,
          level: skill.level
            ? Number(skill.level)
            : null,
          icon: skill.icon || null,
          userId,
        })),
      });

    res.status(201).json({
      success: true,
      count: createdSkills.count,
    });
  } catch (error) {
    console.error(
      "CREATE SKILLS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

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
