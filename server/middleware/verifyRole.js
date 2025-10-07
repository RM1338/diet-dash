const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({ message: 'Access denied: No role found' });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ 
        message: `Access denied: ${req.userRole} role is not authorized` 
      });
    }

    next();
  };
};

module.exports = { verifyRole };