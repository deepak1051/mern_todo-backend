import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Blog from '../model/Blog.js';
import User from '../model/User.js';

const getBlogsByUser = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ userId: req.user._id });
  res.status(200).json(blogs);
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const allBlogs = await Blog.find({});
  res.status(200).json(allBlogs);
});

const postBlog = asyncHandler(async (req, res) => {
  const { title, body, imageUrl } = req.body;
  if (!title || !body || !imageUrl) {
    res.status(400);
    throw new Error('Please add all fields.');
  }
  const blog = await Blog.create({
    title,
    body,
    imageUrl,
    userId: req.user._id,
  });
  res.status(200).json(blog);
});

const getSingleBlog = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Please provide a valid mongoose ID');
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(400);
    throw new Error('The blog with the given ID was not found.');
  }
  res.status(200).json(blog);
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, body, imageUrl } = req.body;
  if (!title || !body || !imageUrl) {
    res.status(400);
    throw new Error('Please provide all fields');
  }

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error('Please provide a valid mongoose ID');
  }

  const _blog = await Blog.findById(req.params.id);

  if (!_blog) {
    res.status(401);
    throw new Error('Goal not found');
  }

  if (_blog.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('You are not authorized to do it');
  }

  const blog = await Blog.findByIdAndUpdate(
    id,
    {
      title,
      imageUrl,
      body,
    },
    { new: true }
  );

  if (!blog) {
    res.status(404);
    throw new Error('The goal with the given ID was not found.');
  }

  res.status(200).json(blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Please provide a valid mongoose ID');
  }

  const _blog = await Blog.findById(req.params.id);

  if (!_blog) {
    res.status(401);
    throw new Error('Blog not found');
  }

  if (_blog.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('You are not authorized to do it');
  }
  const blog = await Blog.findByIdAndRemove(req.params.id);

  if (!blog) {
    res.status(400);
    throw new Error('The blog with the given ID was not found.');
  }
  res.status(200).json({ id: blog._id });
});

export {
  getBlogsByUser,
  getAllBlogs,
  postBlog,
  updateBlog,
  deleteBlog,
  getSingleBlog,
};
