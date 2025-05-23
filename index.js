require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const cors = require("cors");
const { createResearchEntries } = require("./service");
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//requie models
const User = require(path.join(__dirname, "models", "user-model"));

//requiring routes
const addUser = require(path.join(__dirname, "routes", "add-user"));
const Articles = require(path.join(__dirname, "routes", "articles"));
const classroute = require(path.join(__dirname, "routes", "class-route"));
const fetchData = require(path.join(__dirname, "routes", "fetchData"));
const login = require(path.join(__dirname, "routes", "login"));
const proctoring = require(path.join(__dirname, "routes", "Proctoring"));
const Research = require(path.join(__dirname, "routes", "researchwork"));
const signup = require(path.join(__dirname, "routes", "signup"));
const users = require(path.join(__dirname, "routes", "user"));
const Workshops = require(path.join(__dirname, "routes", "workshops"));
const others = require(path.join(__dirname, "routes", "otherRoute"));
const userDelete = require(path.join(__dirname, "routes", "users"));
const facultyScoreRoute = require('./routes/facultyScore');
const operations = require(path.join(__dirname, "routes", "operations"));

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://aditya-b.onrender.com',
        'https://aditya-f.vercel.app',
        'https://aditya-frontend.vercel.app'
    ],
    credentials: true,
    exposedHeaders: ['Authorization']
};
app.use(cors(corsOptions));
// createResearchEntries();
//using routes
app.use("/addUser", addUser);
app.use("/article", Articles);
app.use("/classes", classroute);
app.use("/fetchData", fetchData);
app.use("/login", login);
app.use("/proctoring", proctoring);
app.use("/research", Research);
app.use("/signup", signup);
app.use("/users", users);
app.use("/workshop", Workshops);
app.use("/", others);
app.use("/delete-user", userDelete);
app.use("/operations", operations);
app.use('/faculty', facultyScoreRoute);
// Database Connection
const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB is connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};


// Call the database connection function
ConnectDB();

// Routes
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
});
app.get("/", (req, res) => {
    res.send("Welcome to Aditya backend");
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));