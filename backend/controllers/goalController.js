import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Goal from '../model/Goal.js';
import User from '../model/User.js';

const getGoal = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  res.status(200).json(goals);
});

const postGoal = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error('Please add a text field');
  }
  const goal = await Goal.create({ text, user: req.user._id });
  res.status(200).json(goal);
});

const getSingleGoal = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Please provide a valid mongoose ID');
  }

  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error('The goal with the given ID was not found.');
  }
  res.status(200).json(goal);
});

const updateGoal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error('Please provide a text fields');
  }

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error('Please provide a valid mongoose ID');
  }

  const _goal = await Goal.findById(req.params.id);

  if (!_goal) {
    res.status(401);
    throw new Error('Goal not found');
  }

  if (_goal.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('You are not authorized to do it');
  }

  const goal = await Goal.findByIdAndUpdate(
    id,
    {
      text,
    },
    { new: true }
  );

  if (!goal) {
    res.status(404);
    throw new Error('The goal with the given ID was not found.');
  }

  res.status(200).json(goal);
});

const deleteGoal = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Please provide a valid mongoose ID');
  }

  const _goal = await Goal.findById(req.params.id);

  if (!_goal) {
    res.status(401);
    throw new Error('Goal not found');
  }

  if (_goal.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('You are not authorized to do it');
  }
  const goal = await Goal.findByIdAndRemove(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error('The goal with the given ID was not found.');
  }
  res.status(200).json({ id: goal._id });
});

export { getGoal, postGoal, updateGoal, deleteGoal, getSingleGoal };
