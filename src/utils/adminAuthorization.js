const adminAuthorization = (req, res, next) => {
  const userRole = req.user.user.role;
  if (userRole === "ADMIN") {
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports = adminAuthorization;
