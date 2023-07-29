import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },

    title: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    body: String,
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
