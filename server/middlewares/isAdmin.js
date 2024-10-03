export const isAdmin = (req, res, next) => {
    try {
      if (req.user.role !== "admin")
        return res.status(401).json({
          message: "Only authorized to Admin",
        });
  
      next();
    } catch (error) {
      res.status(401).json({
        message: error.message,
      });
    }
  };