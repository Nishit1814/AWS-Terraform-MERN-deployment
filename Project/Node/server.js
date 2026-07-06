// Load environment variables from .env file
require("dotenv").config();

// Import required packages
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { initSocket } = require("./socket/socketManager");

// Import route files
const userRoutes = require("./routes/userRoutes");
const tripRoutes = require("./routes/tripRouts");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRouts = require("./routes/paymentRouts");
const historyRoutes = require("./routes/historyRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const cancellationRoutes = require("./routes/cancellationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Create Express application
const app = express();

// Create HTTP server to allow Socket.io and Express to run together
const server = http.createServer(app);
initSocket(server);

// MIDDLEWARE SECTION
// Enable CORS (Allows frontend React to call backend API)
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());                  // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// ROUTES SECTION
app.use('/user', userRoutes);
app.use('/trip', tripRoutes);
app.use('/payments', paymentRouts);
app.use('/upload', uploadRoutes);
app.use('/history', historyRoutes);
app.use('/messages', messageRoutes);
app.use('/review', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/cancellation', cancellationRoutes);
app.use("/api", chatRoutes);
app.use('/notifications', notificationRoutes);

// DATABASE CONNECTION
// Added a fallback just in case .env is temporarily unreadable by Docker
const MONGO_URI = process.env.MONGO_URL || "mongodb://13.201.51.98:3000/inextrip";

mongoose.connect(MONGO_URI)
    .then(() => console.log(`MongoDb connected successfully`))
    .catch((err) => console.error("MongoDb Connection Error:", err));

// START SERVER
// Pull the PORT from .env file, or default to 5000 as a safety net
const PORT = process.env.PORT || 5000;

// 🔥 CRITICAL FIX: Use server.listen, NOT app.listen, to keep WebSockets alive
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server and WebSockets are running on port ${PORT}`);
});
