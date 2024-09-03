const imageKitConfig = require('../config/lib/imagekit');
const prisma = require('../config/prisma');
const POSTS_MODEL = require('../models/posts.model');

async function index(req, res) {
    try {
        const posts = await prisma.posts.findMany({
            select: {
                pic: true,
                title: true,
                description: true,
            }
        })

        res.json({
            status: 200,
            message: "Success GET posts API",
            data: posts
        })
    } catch (err) {
        res.status(500).json({
            message: error.message,
        });
    }
}

async function createPost(req, res) {
    try {
        const result = await POSTS_MODEL.create(req);

        res.json({
            status: 201,
            message: "Success POST posts API",
            data: result
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

async function postById(req, res) {
    try {
        const postId = req.params.id;
        const isPostExist = await prisma.posts.findUnique({
            where: {
                id: postId
            }
        })

        if (!isPostExist) {
            throw new Error("Post Not Found");            
        }

        const postDetails = await prisma.posts.findUnique({
            where: {
                id: postId
            },
            select: {
                pic: true,
                title: true,
                description: true,
                userId: true
            }
        })

        res.json({
            status: 200,
            message: 'Success GET post data',
            data: postDetails
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

async function updatePostById(req, res) {
    try {
        const result = await POSTS_MODEL.update(req);
        
        res.status(200).json({
            status: true,
            message: "Success PUT post data",
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

async function deletePostById(req, res) {
    try {
        const postId = req.params.id;
        
        const postData = await prisma.posts.findUnique({
            where: {
                id: postId
            }
        });

        if (!postData) {
            throw new Error("Post is Not Found");            
        }

        const picURL = await imageKitConfig.listFiles({
            url: postData.pic
        })

        if (picURL === 0) {
            throw new Error("Picture URL is Not Found");            
        }

        await imageKitConfig.deleteFile(picURL[0].fileId);

        const result = await prisma.posts.delete({
            where: {
                id: postId
            }
        })

        res.status(200).json({
            status: true,
            message: "Success DELETE post data",
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

module.exports = {
    index,
    createPost,
    postById,
    updatePostById,
    deletePostById
}