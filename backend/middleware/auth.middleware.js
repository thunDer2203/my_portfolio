import jwt from "jsonwebtoken";
import prisma from "../lib/db.js";

/* -------------------------------------------------------------------------- */
/*                              PROTECT ROUTE                                 */
/* -------------------------------------------------------------------------- */

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    /* ------------------------------ No token ------------------------------ */

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /* ----------------------------- Verify JWT ----------------------------- */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /* ------------------------------ Find user ----------------------------- */

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    /* ------------------------------ No user ------------------------------- */

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    /* -------------------------- Attach to request ------------------------- */

    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               ADMIN ONLY                                   */
/* -------------------------------------------------------------------------- */

export const adminOnly = async (req, res, next) => {
  try {
    /* ------------------------- Check authenticated ------------------------ */

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /* ---------------------------- Check role ----------------------------- */

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }

    next();
  } catch (error) {
    console.error("ADMIN MIDDLEWARE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
