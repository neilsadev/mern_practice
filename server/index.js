import express from "express"; // Fast and minimalist web application framework
import bodyParser from "body-parser"; // Middleware for parsing request bodies
import mongoose from "mongoose"; // MongoDB object modeling tool
import cors from "cors"; // Middleware for enabling Cross-Origin Resource Sharing
import dotenv from "dotenv"; // Environment variables management
import multer from "multer"; // Middleware for handling file uploads
import helmet from "helmet"; // Middleware for enhancing application security
import morgan from "morgan"; // HTTP request logger
import path from "path"; // Utility for working with file and directory paths
import { fileURLToPath } from "url"; // Utility for converting file URLs to paths

/* configuration */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config(); // Load environment variables from .env file
const app = express(); // Create an instance of the Express application
app.use(express.json()); // Parse JSON bodies in incoming requests
app.use(helmet()); // Add various security headers to HTTP responses
// Set Cross-Origin Embedder Policy header to 'cross-origin' for all responses
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common")); // Use the 'common' predefined format for request logging
app.use(bodyParser.json({ limit: "30mb", extended: true })); // Parse JSON bodies with a limit of 30mb
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // Parse URL-encoded bodies with a limit of 30mb
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
// Serve static files from the 'public/assets' directory under the '/assets' route
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

import { register } from "./controllers/auth.js";

/* File Storage */

// Configure the storage destination and file naming for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets"); // Set the destination directory for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Set the file name to be the same as the original file name
  },
});
// Create an instance of multer with the configured storage options
const upload = multer({ storage });

/* Routes with files */
// Handle POST request to /auth/register endpoint with file upload
app.post("/auth/register", upload.single("picture"), register);

/* Routes */
app.use("/auth", authRoutes);

/* Mongoose setup */

const PORT = process.env.PORT || 6001; // Set the server port, using the environment variable or default to 6001
// Connect to MongoDB using the MONGO_URL from the environment variables
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true, // Use the new URL parser
    useUnifiedTopology: true, // Use the new server discovery and monitoring engine
  })
  .then(() => {
    // Start the server and listen on the specified port
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
