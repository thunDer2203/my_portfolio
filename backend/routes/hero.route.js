import express from "express";
import prisma from "../lib/db.js";

const router = express.Router();

/* ---------------- GET HERO ---------------- */

router.get("/", async (req, res) => {
  try {
    const hero = await prisma.hero.findFirst();

    res.status(200).json({
      success: true,
      hero,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch hero section",
    });
  }
});

/* ---------------- CREATE/UPDATE HERO ---------------- */

router.post("/", async (req, res) => {
  try {
    const {
      name,
      title,
      subtitle,
      description,
      location,
    } = req.body;

    const existing = await prisma.hero.findFirst();

    let hero;

    if (existing) {
      hero = await prisma.hero.update({
        where: {
          id: existing.id,
        },
        data: {
          name,
          title,
          subtitle,
          description,
          location,
        },
      });
    } else {
      hero = await prisma.hero.create({
        data: {
          name,
          title,
          subtitle,
          description,
          location,
        },
      });
    }

    res.status(200).json({
      success: true,
      hero,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save hero section",
    });
  }
});

export default router;