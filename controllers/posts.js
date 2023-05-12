import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';
import User from "../models/user.js";

export const createPost = async (req, res) => {
    const post = req.body;

    const newPost = new PostMessage({ ...post, creator: req.userId, username: req.username, createdAt: new Date().toISOString() });
    try {
        await newPost.save();
        
        const user = await User.findById(req.userId);

        let newUserPosts = user.posts;
        newUserPosts++;

        await User.findByIdAndUpdate(req.userId, {posts: newUserPosts}, { new: true});

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const getUserPosts = async (req, res) => {
    const { id } = req.query;

    try {
        const postMessages = await PostMessage.find({ creator: id });

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(500).json({ message: "Failed with server" })
    }
}

export const getPostById = async (req, res) => {
    const { id } = req.query;
    
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Failed with server" })
    }
}

export const updatePost = async (req, res) => {
    const { postId, message, selectedFile } = req.body;

    try {

        await PostMessage.findByIdAndUpdate(postId, { message: message, selectedFile: selectedFile }, { new: true });

        const updatedPost = await PostMessage.findById(postId);

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: "Failed with server" })
    }
}

export const deletePost = async (req, res) => {
    const { id } = req.query;

    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");

        await PostMessage.findByIdAndRemove(id);

        res.json({ message: "Deleted post successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed with server" })
    }
}

export const getCommentsById = async (req, res) => {
    const { id } = req.query;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post.comments);
    } catch (error) {
        res.status(500).json({ message: "Failed with server" })
    }
}

export const commentPost = async (req, res) => {
    const { id } = req.query;
    const { value } = req.body;

    try {
        const post = await PostMessage.findById(id);
    
        post.comments.push({ commentCreator: req.username, value: value });
    
        await PostMessage.findByIdAndUpdate(id, post, { new: true });
    
        res.status(200).json({ message: "comment added" });
        
    } catch (error) {
        res.status(500).json({ message: "Failed with server" })
    }

}

export const likePost = async (req, res) => {
    const { id } = req.body;
    console.log(id)
    
    try {
        if(!req.userId) return res.json({ message: "User is not authenticated!" });

        const post = await PostMessage.findById(id);

        const index = post.likes.findIndex(id => id === String(req.userId))

        if(index === -1){
            post.likes.push(req.userId)
        } else {
            post.likes = post.likes.filter(id => id !== String(req.userId))
        }

        await PostMessage.findByIdAndUpdate(id, post, {new: true});

        res.status(200).json({ message: "post liked" });
    } catch (error) {
        res.status(500).json({ message: "Failed with server" })
    }
}