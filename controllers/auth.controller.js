const prisma = require("../config/prisma");
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter } = require('../config/lib/mailer')

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

        console.log(user_payload.password);
        console.log(user.password);
        console.log(isPassword);
        
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
            text: `http://localhost:5500/api/v1/users/change-password/${user.id}`
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

module.exports = {
    login,
    forgetPassword
}