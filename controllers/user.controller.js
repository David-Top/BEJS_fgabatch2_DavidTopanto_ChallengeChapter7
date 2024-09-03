const imageKitConfig = require('../config/lib/imagekit.js');
const prisma = require('../config/prisma/index.js')
const USERS_MODELS = require('../models/users.model.js');

async function index(req, res) {
    try {
        const users = await prisma.users.findMany({
            select: {
                username: true,
                email: true,
                profilePic: true
            }
        })        
        res.json({
            status: 200,
            message: "Success GET Users API",
            data: users
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

async function createUser(req, res) {
    try {        
        const result = await USERS_MODELS.create(req);
        res.json({
            status: 201,
            message: "Success POST Users API",
            data: result
        })        
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
          });
    }
}

async function userById(req, res) {
    try {
        const userId = req.params.id;
        const isUser = await prisma.users.findUnique({
            where: {
                id: userId
            }
        });

        if (!isUser) {
            throw new Error('User not found');
        }

        const userDetails = await prisma.users.findUnique({
            where: {
                id: userId
            },
            select: {
                username: true,
                email: true,
                profilePic: true
            }
        })

        res.json({
            status: 200,
            message: 'Success GET user data',
            data: userDetails
        })
        return userDetails;
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
          });
    }
}

async function updateProfilePic(req, res) {
    try {
        const upload = await USERS_MODELS.updateProfilePic(req);

        res.status(200).json({
            status: true,
            message: "Succes PUT User Profile Picture data",
            data: upload,
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
          });
    }
}

module.exports = {
    index,
    createUser,
    userById,
    updateProfilePic
}