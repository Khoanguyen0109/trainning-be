const adminAuthorization = (req, res, next) => {
  console.log("req.user :>> ", req.user);
  const userRole = req.user.role;
  if (userRole === "ADMIN") {
    next();
  } else {
    res.sendStatus(401).json({ error: "Just for Admin" });
  }
};

module.exports = adminAuthorization;
