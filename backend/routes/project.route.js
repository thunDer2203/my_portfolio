
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
      where:{
        userId: 1,
      },
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


router.get("/secure", protectRoute, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where:{
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // console.log("SECURE PROJECTS:", projects);
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

// /* -------------------------------------------------------------------------- */
// /*                              GET PROJECT by username                       */
// /* -------------------------------------------------------------------------- */

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    // console.log("FETCH PROJECT:", username);
    const project = await prisma.project.findMany({
      where: {
        user: {
          username: {
        equals: username,
        mode: 'insensitive',
      },
        },
      },
    });
    // console.log("FETCH PROJECT:", username, project);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      projects:project,
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
    const { projects } = req.body;

    if (!Array.isArray(projects)) {
      return res.status(400).json({
        success: false,
        message: "projects must be an array",
      });
    }

    const userId = req.user.id;

    // Remove old projects
    await prisma.project.deleteMany({
      where: {
        userId,
      },
    });

    // Create new projects
    const createdProjects =
      await prisma.project.createMany({
        data: projects.map((project) => ({
          title: project.title,
          slug: project.slug,
          shortDescription:
            project.shortDescription,
          longDescription:
            project.longDescription || null,
          image: project.image || null,
          githubUrl: project.githubUrl || null,
          liveUrl: project.liveUrl || null,
          featured: project.featured || false,
          techStack: project.techStack || [],
          userId,
        })),
      });

    res.status(201).json({
      success: true,
      count: createdProjects.count,
    });
  } catch (error) {
    console.error(
      "CREATE PROJECTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                               DELETE PROJECT                               */
/* -------------------------------------------------------------------------- */


export default router;
