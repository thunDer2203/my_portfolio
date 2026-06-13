
import express from "express";
import prisma from "../lib/db.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                           GET ALL EXPERIENCE                               */
/* -------------------------------------------------------------------------- */

router.get("/", async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      where:{
        userId: 1,  
      },
      orderBy: {
        startDate: "desc",
      },
    });
    // console.log(experiences);
    res.status(200).json({
      success: true,
      experiences,
    });
  } catch (error) {
    console.error("GET EXPERIENCE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});



router.get("/secure", protectRoute, async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      where:{
        userId: req.user.id,  
      },
      orderBy: {
        startDate: "desc",
      },
    });
    // console.log(experiences);
    res.status(200).json({
      success: true,
      experiences,
    });
  } catch (error) {
    console.error("GET EXPERIENCE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                            CREATE EXPERIENCE                               */
/* -------------------------------------------------------------------------- */

router.post("/", protectRoute, async (req, res) => {
  try {
    const { experiences } = req.body;

    if (!Array.isArray(experiences)) {
      return res.status(400).json({
        success: false,
        message: "experiences must be an array",
      });
    }

    const userId = req.user.id;

    // Remove existing experiences for this user
    await prisma.experience.deleteMany({
      where: {
        userId,
      },
    });

    // Create new experiences
    const createdExperiences =
      await prisma.experience.createMany({
        data: experiences.map((exp) => ({
          company: exp.company,
          role: exp.role,
          description: exp.description || null,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate
            ? new Date(exp.endDate)
            : null,
          currentlyWorking:
            exp.currentlyWorking || false,
          userId,
        })),
      });

    res.status(201).json({
      success: true,
      count: createdExperiences.count,
    });
  } catch (error) {
    console.error(
      "CREATE EXPERIENCES ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
/* -------------------------------------------------------------------------- */
/*                     GET EXPERIENCE BY USERNAME                             */
/* -------------------------------------------------------------------------- */

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const experiences = await prisma.experience.findMany({
      where: {
        user: {
          username: {
        equals: username,
        mode: 'insensitive',
      },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    // console.log("FETCH EXPERIENCE:", username, experiences);
    res.status(200).json({
      success: true,
      experiences,
    });
  } catch (error) {
    console.error("GET USER EXPERIENCE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;