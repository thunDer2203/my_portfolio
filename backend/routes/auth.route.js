import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import prisma from "../lib/db.js";
import { generateToken } from "../lib/utils.js";

dotenv.config();

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                               CHECK SESSION                                */
/* -------------------------------------------------------------------------- */

router.get("/check", async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Refresh token
    generateToken(user.id, res);

    res.status(200).json({
      success: true,
      message: "Authenticated",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("CHECK AUTH ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                                  REGISTER                                  */
/* -------------------------------------------------------------------------- */

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    /* ------------------------------ Validation ----------------------------- */

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    /* ------------------------------ Existing user ----------------------------- */

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    /* ----------------------------- Hash password ---------------------------- */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ------------------------------- Create user ------------------------------ */

    const newUser = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    /* ------------------------------- Generate JWT ------------------------------ */

    generateToken(newUser.id, res);

    /* -------------------------------- Response -------------------------------- */

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ------------------------------ Validation ----------------------------- */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /* ------------------------------- Find user ------------------------------ */

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ---------------------------- Compare password --------------------------- */

    const isCorrectPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!isCorrectPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ------------------------------ Generate JWT ----------------------------- */

    generateToken(user.id, res);

    /* -------------------------------- Response -------------------------------- */

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                                   LOGOUT                                   */
/* -------------------------------------------------------------------------- */

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                                CURRENT USER                                */
/* -------------------------------------------------------------------------- */

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("ME ROUTE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
