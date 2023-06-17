import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../model/User.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password ');
      if (!user) {
        res.status(400);
        throw new Error('User no longer exists');
      }
      req.user = user;
      next();
    } catch {
      res.status(401);
      throw new Error('Invalid Token.');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorization, no token');
  }
});

export default protect;
