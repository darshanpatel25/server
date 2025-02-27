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

//check permissions if admin the directly bypass and if simple user  

exports.checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.headers.id;
      

      const user = await userModel.findById(userId).populate({
        path: 'teams',
        populate: {
          path: 'permissions',
          model: 'Permission'
        }
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (user.access === 1) {
        next()
      }
      else {

        const userPermissions = new Set();
        user.teams.forEach(team => {
          team.permissions.forEach(permission => {
            userPermissions.add(permission.name);
          });
        });
      

        // block if not permited
        if (!userPermissions.has(requiredPermission)) {
          return res.status(403).json({ success: false, message: 'Access denied' });
        }
        console.log("middleware passed")
        next(); // access allowed
      }


    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error in middleware' });
    }
  };
};
