import User from "../schemas/user.js";
import JWT from "jsonwebtoken";

export const login = {
    validator:(req,res,next)=>{
        if(!req.body.role || !req.body.username || !req.body.password){
            return res.status(400).send("Pass all information ( role,username and password )") // if data is not passed with query
        }
        next()
    },
    controller:async(req,res)=>{
        try{
            const {username,password,role} = req.body

            const user = await User.findOne({username,password,role})

            if(!user){
                return res.status(400).send("invalid username or password") // if username-password pair isn't exists
            }


            const accessToken = JWT.sign(
                {
                    id: user._id,
                },
                process.env.JWT_SEC_KEY,
                { expiresIn: "3d" }
            );


            res.cookie('vintagetoken', accessToken, { maxAge: 1000 * 60 * 60 * 24 * 3 // cookie will last for 3 day only
                                                    , httpOnly: false 
                                                    }); // setting the cookie in request


            
            const {pwd=password, ...userDataWithoutPassword} = user._doc; // extracting password from userdata
                                                  
            return res.status(200).json({
                accessToken,
                ...userDataWithoutPassword
            })
        }
        catch(e){
            console.log("error",e);
            return res.status(500).send(e);
        }
    }
}

export const signup = {
    validator:(req,res,next) =>{
        if(!req.body.role || !req.body.username || !req.body.password || !req.body.email || !req.body.phone){
            return res.status(400).send("Pass all information")
        }
        if(req.body.role === "ADMIN"){
            return res.status(400).send("Admin cant be created")
        }
        if (req.body.username.indexOf(' ') >= 0) {
            return res.status(400).send("Username should not contain any space");
        }
        if (req.body.username.length < 3) {
            return res.status(400).send("Username must be greater than 3 characters");
        }
        if(req.body.role === "SELLER" && !req.body.bankAc){
            return res.status(400).send("Please pass the bank account number")
        }
        next()
    },
    controller:async(req,res) =>{
        const {role,username,password,email,phone} = req.body

        const user = await User.findOne({$or:[{username,email}]})

        if(user){
            return res.status(400).send("username or email already exists")
        }

        let newUser = {
            role,username,password,email,phone
        }

        if(role === "SELLER"){
            newUser = { ...newUser, bankDetails:{accountno:req.body.bankAc}}
        }
        try{

            await User.create(newUser)





            return res.status(200).send("User created successfully")
        }
        catch(e){
            return res.status(500).send("User didn't created")
        }
    }
}