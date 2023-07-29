import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Comment from '../model/Comment.js';

const createComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { blogId } = req.params;

  if (!text) {
    res.status(400);
    throw new Error('Please add a comment text.');
  }
  if (!mongoose.isValidObjectId(blogId)) {
    res.status(400);
    throw new Error('Please provide a valid mongoose ID');
  }

  const comment = await Comment.create({
    text,
    userId: req.user._id,
    username: req.user.name,
    blogId,
  });

  res.status(201).json(comment);
});

const getComments = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  if (!mongoose.isValidObjectId(blogId)) {
    res.status(400);
    throw new Error('Please provide a valid mongoose ID');
  }

  const comments = await Comment.find({
    blogId,
  });

  res.status(200).json(comments);
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) {
    res.status(400);
    throw new Error('Please provide a valid mongoose ID');
  }

  const _comment = await Comment.findById(commentId);

  if (!_comment) {
    res.status(401);
    throw new Error('comment not found');
  }

  if (_comment.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('You are not authorized to do it');
  }
  const comment = await Comment.findByIdAndRemove(commentId);

  if (!comment) {
    res.status(400);
    throw new Error('The comment with the given ID was not found.');
  }
  res.status(200).json({ id: comment._id });
});

export { createComment, getComments, deleteComment };
