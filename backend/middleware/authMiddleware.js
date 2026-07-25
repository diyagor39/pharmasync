/* ============================
   PharmaSync Backend - Auth Middleware
   Verifies JWT token on protected routes.
   ============================ */

const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = decoded; // { id, role, email }
    next();
  });
}

// Optional: restrict route to specific roles, e.g. requireRole("admin")
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You don't have permission to do this." });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };
