const prisma = require("../config/prisma");
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter } = require('../config/lib/mailer')

async function register(req, res) {
    const user_payload = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    if (!user_payload.username || !user_payload.email || !user_payload.password) {
        throw new Error("Data can not be Null");        
    }

    try {
        const result = await prisma.users.create({
            data:{
                username: user_payload.username,
                email: user_payload.email,
                password: bycrypt.hashSync(user_payload.password, 10) //hashing user's password
            },
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
                profilePic: true,
                otp: true,
                socket_id: true,
                user_agent: true,
                createdAt: true
            }
        });
        
        res.json({
            status: 201,
            message: "Register Succesfully",
            data: result
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

async function login(req, res) {
    const user_agent = req.headers['user-agent'];

    //Take email and password that user input from req.body    
    const user_payload = {
        email: req.body.email,
        password: req.body.password
    }    
    
    try {
        //select user by email
        const user = await prisma.users.findUnique({
            where: {
                email: user_payload.email
            }
        });
    
        if (!user) {
            throw new Error("User is Not Found");        
        }
                
        const isPassword = bycrypt.compareSync(user_payload.password, user.password);    //compare inputed password and password in database (already been hashed)

        // console.log(user_payload.password);
        // console.log(user.password);
        // console.log(isPassword);
        
        if (!isPassword) {
            throw new Error('Username or Password not Match')
        }        

        if (user_agent === user.user_agent) {
            const token = jwt.sign(payloadToken, process.env.JWT_SECRET, {
                expiresIn: '1h'
            })
            return res.status(200).json({
                message: "Login Successully",
                token: token
            });
        }else{
            const otp = Math.floor(1000 + Math.random() * 9000);

            await prisma.users.update({
                where: {
                    email: user.email
                },
                data: {
                    otp: otp.toString()
                }
            });

            transporter.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: "OTP Verification",
                text: `Your OTP is ${otp}`
            })                        
        }
        
        return res.status(200).json({ 
            message: 'Check your e-mail',
            is_need_otp: true
         });
    } catch (err) {
        res.status(401).json({
            message: err.message
        })
        console.log(err)
    }
}

async function forgetPassword(req, res) {
    const user_payload = {
        email: req.body.email
    }
    
    try {
        const user = await prisma.users.findUnique({
            where: {
                email: user_payload.email
            }
        });

        if (!user.email) {
            throw new Error('User Not Found');
        }

        transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Reset Password",
            text: `http://localhost:5500/api/v1/change-password/${user.id}`
        })

        return res.status(200).json({
            message: "Link sent, check your e-mail"
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
        console.log(err)
    }
}

async function changePassword(req, res) {
    const user_payload = {
        id: req.params.id,
        password: req.body.password
    }

    try {
        const user = await prisma.users.findUnique({
            where: {
                id: user_payload.id
            }
        });

        if (!user) {
            throw new Error("User Not Found");            
        }

        if (!user_payload.password) {
            throw new Error("Data Can Not be Null");            
        }

        const result = await prisma.users.update({
            where: {
                id: user_payload.id
            },
            data: {
                password: bycrypt.hashSync(user_payload.password, 10)
            }
        });

        res.status(200).json({
            status: true,
            message: "Success Password has been Updated",
            data: result
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

module.exports = {
    register,
    login,
    forgetPassword,
    changePassword
}