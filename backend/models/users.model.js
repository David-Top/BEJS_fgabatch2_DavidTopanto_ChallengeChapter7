// const DB = require('../config/db');
const bcrypt = require('bcrypt');

const imageKitConfig = require("../config/lib/imagekit");
const prisma = require("../config/prisma/index");

const USERS = {
  // create: async (req) => {
  //   try {
  //     const { username, email, password } = req.body;
  //     const user = await prisma.users.create({
  //       data: {
  //         username,
  //         email,
  //         password: bcrypt.hashSync(password, 10), //hashing user's password
  //       },
  //       select: {
  //         id: true,
  //         username: true,
  //         email: true,
  //         password: true,
  //         profilePic: true,
  //         createdAt: true,
  //       },
  //     });
  //     return user;
  //   } catch (err) {
  //     console.log(err);
  //     return { status: "failed", message: err.message };
  //   }
  // },

  updateProfilePic: async (req) => {
    const userId = req.params.id;
    const isUser = await prisma.users.findUnique({
        where: {
            id: userId
        }
    });
    if (!isUser) {
        throw new Error("User Not Found");
    }

    const profilePicture = req.file;
    if (!profilePicture) {
      throw new Error("Please upload the Picture");
    }

    try {
        const uploadProfilePic = await imageKitConfig.upload({
            fileName: profilePicture.originalname,
            file: profilePicture.buffer,
            folder: "/ch6-assets/profilePic"
        })

        const result = await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                profilePic: uploadProfilePic.url
            }
        })

        return result;
    } catch (err) {
      console.log(err);
      return { status: "failed", message: err.message };
    }
  },

  update: async (req) => {
    const userId = req.params.id;
    const isUser = await prisma.users.findUnique({
        where: {
            id: userId
        }
    })
    if (!isUser) {
        throw new Error("User not Found");
    }

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new Error("Data can not be Null");        
    }

    try {
        const result = await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                username,
                email,
                password
            }
        })

        return result;
    } catch (err) {
        console.log(err);
        return {
            status: "failed",
            message: err.message
        }
    }
  },

  // updatePassword: async (req) => {  
  //   const user_payload = {
  //     id: req.params.id,
  //     password: req.body.password
  //   }

  //   try {
  //     const user = await prisma.users.findUnique({
  //       where: {
  //         id: user_payload.id
  //       }
  //     });
  
  //     if (!user) {
  //       throw new Error("User Not Found");      
  //     }

  //     if (!user_payload.password) {
  //       throw new Error("Data Can Not be Null");        
  //     }

  //     return await prisma.users.update({
  //       where: {
  //         id: user_payload.id
  //       },
  //       data: {
  //         password: bcrypt.hashSync(user_payload.password, 10), //hashing user's password
  //       }
  //     });      
  //   } catch (err) {
  //     console.log(err);
  //       return {
  //           status: "failed",
  //           message: err.message
  //       }
  //   }
  // }
};

module.exports = USERS;
