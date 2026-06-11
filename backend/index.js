import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import resumeRoutes from "./routes/resume.route.js";
import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./routes/project.route.js";
import skillRoutes from "./routes/skill.route.js";
import contactRoutes from "./routes/contact.route.js";
import experienceRoutes from "./routes/experience.route.js";
import socialRoutes from "./routes/social.route.js";
// import heroRoutes from "./routes/hero.route.js";
import aboutRoutes from "./routes/about.route.js";
import portfolioRoutes from "./routes/portfolio.route.js";


const app = express();

const PORT = process.env.PORT || 5000;


app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());



app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Portfolio CMS API Running 🚀",
  });
});


app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/skills", skillRoutes);

app.use("/api/experience", experienceRoutes);

app.use("/api/socials", socialRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/resume", resumeRoutes);


app.use("/api/about", aboutRoutes);

app.use("/api/users", portfolioRoutes);



app.listen(PORT, () => {
  console.log(`🚀 Portfolio CMS running on port ${PORT}`);
});
