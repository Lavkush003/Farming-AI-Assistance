import Post from "../models/Post.js";

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, body, author, authorId, image } = req.body;
    
    if (!title || !body || !author || !authorId) {
      return res.status(400).json({ error: "Title, body, author, and authorId are required" });
    }

    const newPost = new Post({ title, body, author, authorId, image });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;

    if (!text || !author) {
      return res.status(400).json({ error: "Comment text and author are required" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({ text, author });
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ error: "Failed to like post" });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};
