const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");


// check login

exports.requireSignIn = async (req, res, next) => {
  try {
    const decode = await JWT.verify(
      req.headers.authtoken,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    res.status(401).json({ success: false, messgae: "Access denied" });
  }
};

// check admin

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.access !== 1) {
      return res
        .status(200)
        .json({ success: false, message: "Admin Access denied" });
    } else {
      // res.status(200).json({ success: true, message: "Admin access granted" });
      next();
    }
  } catch (error) {
    console.log(error);
  }
};



exports.checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.headers.id;

      const user = await userModel.findById(userId)
        .populate({
          path: "teams",
          populate: {
            path: "permissions",
            model: "Permission",
          },
        })
        .populate({
          path: "roles", 
          populate: {
            path: "permissions",
            model: "Permission",
          },
        });

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (user.access === 1) {
        return next(); 
      }

      const userPermissions = new Set();

      
      user.teams.forEach((team) => {
        team.permissions.forEach((permission) => {
          userPermissions.add(permission.name);
        });
      });

    
      user.roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          userPermissions.add(permission.name);
        });
      });

    
      if (!userPermissions.has(requiredPermission)) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      console.log("middleware passed");
      next(); 

    } catch (error) {
      console.error("Middleware error:", error);
      res.status(500).json({ success: false, message: "Internal server error in middleware" });
    }
  };
};
