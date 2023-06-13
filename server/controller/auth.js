import bcrypt from "bcrypt";
import { Jwt } from "jsonwebtoken";
import User from "../models/User.js";

/* Register user */
export const register = async (req, res) => {
  try {
    // Destructure the request body to extract the required fields
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new User instance with the extracted fields and hashed password
    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Send a response with the saved user
    res.status(201).json(savedUser);
  } catch (err) {
    // If an error occurs, send a response with the error message
    res.status(500).json({ error: err.message });
  }
};
