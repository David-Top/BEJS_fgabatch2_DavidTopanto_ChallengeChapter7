const prisma = require("../config/prisma/index");
const imageKitConfig = require("../config/lib/imagekit");

const POSTS = {
    create: async (req) => {
        const pic = req.file;
        if (!pic) {
            throw new Error("Please upload the Image");            
        }

        // console.log(pic);
        try {            
            const { title, description, userId } = req.body;

            // const isTitleExist = await prisma.posts.findUnique({
            //     where: {
            //         title: title
            //     }
            // })

            // if (isTitleExist) {
            //     throw new Error("Please enter another title, title already exist");                
            // }

            const uploadPic = await imageKitConfig.upload({
                fileName: pic.originalname,
                file: pic.buffer,
                folder: "/ch6-assets/pic"
            })

            const result = await prisma.posts.create({
                data: {
                    pic: uploadPic.url,
                    title,
                    description,
                    userId
                },
                select: {
                    id: true,
                    pic: true,
                    title: true,
                    description: true,
                    userId: true,
                    createdAt: true
                }
            })

            return result;
        } catch (err) {
            console.log(err);
            return { status: "failed", message: err.message };
        }
    },

    update: async (req) =>{
        const { title, description } = req.body;
        const postId = req.params.id;

        const isPostExist = await prisma.posts.findUnique({
            where: {
                id: postId
            }
        })

        if (!isPostExist) {
            throw new Error("Post Not Found");            
        }
        
        return await prisma.posts.update({
            where: {
                id: postId
            },
            data: {
                title,
                description
            }
        })
    }
}

module.exports = POSTS;