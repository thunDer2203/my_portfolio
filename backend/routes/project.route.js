
import express from "express";
import prisma from "../lib/db.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                              GET ALL PROJECTS                              */
/* -------------------------------------------------------------------------- */

router.get("/", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                              GET SINGLE PROJECT                            */
/* -------------------------------------------------------------------------- */

router.get("/:slug", async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: {
        slug: req.params.slug,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("GET PROJECT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                               CREATE PROJECT                               */
/* -------------------------------------------------------------------------- */

router.post("/", protectRoute, async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      longDescription,
      image,
      githubUrl,
      liveUrl,
      techStack,
      featured,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        shortDescription,
        longDescription,
        image,
        githubUrl,
        liveUrl,
        techStack,
        featured,
      },
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                               DELETE PROJECT                               */
/* -------------------------------------------------------------------------- */

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    await prisma.project.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Project deleted",
    });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
