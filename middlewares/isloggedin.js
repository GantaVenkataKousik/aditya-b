const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
    try {
        let token;
         // Check for token in cookies
         if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
      
         // If not found in cookies, check in headers
         if ( !token && req.headers.authorization) {
            const authHeader = req.headers.authorization;

            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7, authHeader.length); // Remove 'Bearer ' prefix
            }
        }
        
        // If token is still not found, return an error
        if (!token) {
            console.error("Token is missing from cookies or headers");
            return res.status(401).json({
                success: false,
                message: "Authentication failed: Token is missing",
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Find the user based on the decoded token
        const user = await userModel.findOne({ email: decoded.email }).select("-password");
        if (!user) {
            console.error("User not found for the provided token");
            return res.status(404).json({
                success: false,
                message: "Authentication failed: User not found",
            });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === "TokenExpiredError") {
            console.error("Token expired");
            return res.status(401).json({
                success: false,
                message: "Authentication failed: Token has expired",
            });
        } else if (error.name === "JsonWebTokenError") {
            console.error("Malformed token:", error.message);
            return res.status(400).json({
                success: false,
                message: `Authentication failed: ${error.message}`,
            });
        } else {
            console.error("Unexpected authentication error:", error);
            return res.status(500).json({
                success: false,
                message: "Authentication failed: An unexpected error occurred",
            });
        }
    }
};
