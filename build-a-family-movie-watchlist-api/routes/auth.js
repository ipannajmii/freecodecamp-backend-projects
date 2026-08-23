import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { findByUsername } from "../utils/db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required.",
      });
    }

    const user = findByUsername(username);

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "grading-secret-value",
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
});

export default router;