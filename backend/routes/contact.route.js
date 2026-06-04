import express from "express";
import prisma from "../lib/db.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                           SEND CONTACT MESSAGE                             */
/* -------------------------------------------------------------------------- */

router.post("/", async (req, res) => {
  try {
    let { name, email, subject, message } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    subject = subject?.trim();
    message = message?.trim();

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send message right now.",
    });
  }
});

export default router;