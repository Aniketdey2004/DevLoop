import Post from "../models/Post.js";
import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/Notification.js";

export const getPostFeed = async (req, res) => {
  try {
    const feedPosts = await Post.find({
      author: { $in: [...req.user.followers, req.user._id] },
    })
      .populate("author", "name profilePic headline username")
      .populate("likes", "name profilePic headline username")
      .populate("comments.user", "name profilePic username headline")
      .sort({ createdAt: -1 });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getPostFeed Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image, type } = req.body;
    if (!type) {
      return res.status(400).json({ message: "Post should have a type" });
    }
    if (!image && !content) {
      return res
        .status(400)
        .json({ message: "Post should have some material" });
    }
    let newPost;
    if (image) {
      const postImg = await cloudinary.uploader.upload(image);
      newPost = new Post({
        author:req.user._id,
        content,
        image: postImg.secure_url,
        type,
      });
    } else {
      newPost = new Post({
        author:req.user._id,
        content,
        type,
      });
    }
    newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in createPost controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId.toString()) {
      return res.status(403).status({ message: "You are not authorized" });
    }

    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (error) {
    console.log("Error in deletePost controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("author", "name username profilePic headline")
      .populate("likes", "name username profilePic headline")
      .populate("comments.user", "name username headline profilePic");

    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in getPost controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment should have content" });
    }
    const comment = {
      content,
      user: req.user._id,
    };
    const post = await Post.findByIdAndUpdate(
      { _id:postId },
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("author", "name username profilePic headline")
      .populate("likes", "name username profilePic headline")
      .populate("comments.user", "name username headline profilePic");

    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }
    //if comment creator is not post author then send notification
    if (post.author._id.toString() !== req.user._id.toString()) {
      const newNotification = new Notification({
        recipient: post.author._id,
        relatedUser: req.user._id,
        type: "comment",
        relatedPost: post._id,
      });
      await newNotification.save();
    }

    res.status(201).json(post);
  } catch (error) {
    console.log("Error in createComment controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    let post = await Post.findOneAndUpdate(
      { _id: postId, likes: { $ne: userId } },
      { $addToSet: { likes: userId } },
      { new: true }
    )
      .populate("author", "name username profilePic headline")
      .populate("likes", "name username profilePic headline")
      .populate("comments.user", "name username headline profilePic");

    if (post) {
      if (post.author._id.toString() !== req.user._id.toString()) {
        const newNotification = new Notification({
          recipient: post.author._id,
          relatedUser: req.user._id,
          type: "like",
          relatedPost: postId,
        });
        await newNotification.save();
      }
      return res.status(200).json(post);
    }

    post = await Post.findByIdAndUpdate(
      { postId },
      { $pull: { likes: userId } },
      { new: true }
    )
      .populate("author", "name username profilePic headline")
      .populate("likes", "name username profilePic headline")
      .populate("comments.user", "name username headline profilePic");

    if(!post){
      return res.status(404).json({message:"Post does not exist"});
    }
    res.status(200).json(post);
  } catch (error) {
    console.log("Error in likePost controller",error);
    res.status(500).json({message:"Internal Server Error"});
  }
};
