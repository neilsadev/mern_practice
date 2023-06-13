import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

/* Log in */
export const login = async (req, res) => {
  try {
    // Destructure the email and password from the request body
    const { email, password } = req.body;
    // Find a user with the provided email in the database
    const user = await User.findOne({ email: email });
    // If no user is found, return an error response
    if (!user) return res.status(400).json({ msg: "User does not exist." });
    // Compare the provided password with the user's hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    // If the passwords do not match, return an error response
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
    // If the passwords match, generate a JSON Web Token (JWT)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // Remove the password field from the user object before sending the response
    delete user.password;
    // Send a success response with the generated token and the user object
    res.status(200).json({ token, user });
  } catch (err) {
    // If an error occurs, send a response with the error message
    res.status(500).json({ error: err.message });
  }
};
