
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
      orderBy: {
        startDate: "desc",
      },
    });
    console.log(experiences);
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
    const {
      company,
      role,
      description,
      startDate,
      endDate,
      currentlyWorking,
    } = req.body;

    const experience = await prisma.experience.create({
      data: {
        company,
        role,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        currentlyWorking,
      },
    });

    res.status(201).json({
      success: true,
      experience,
    });
  } catch (error) {
    console.error("CREATE EXPERIENCE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;