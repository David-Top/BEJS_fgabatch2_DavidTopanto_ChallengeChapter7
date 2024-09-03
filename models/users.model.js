// const DB = require('../config/db');

const imageKitConfig = require("../config/lib/imagekit");
const prisma = require("../config/prisma/index");

const USERS = {
  create: async (req) => {
    try {
      const { username, email, password } = req.body;
      const user = await prisma.users.create({
        data: {
          username,
          email,
          password,
        },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          profilePic: true,
          createdAt: true,
        },
      });
      return user;
    } catch (err) {
      console.log(err);
      return { status: "failed", message: err.message };
    }
  },

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
};

module.exports = USERS;
