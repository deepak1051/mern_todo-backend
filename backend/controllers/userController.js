import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const isExist = await User.findOne({ email });
  if (isExist) {
    res.status(400);
    throw new Error('User already exists');
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: genToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Error creating user');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);
  if (!isMatch) {
    res.status(400);
    throw new Error('Invalid email or password');
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: genToken(user._id),
  });
});

//private routes
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const genToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
export { registerUser, loginUser, getMe };
