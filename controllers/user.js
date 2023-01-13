import User from "../schemas/user.js";
import JWT from "jsonwebtoken";
import Cart from "../schemas/cart.js";
import mongoose from "mongoose";

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

            const user = await User.create(newUser)

            if(role === "BUYER"){


            const cart = await Cart.create({
                items:[],
                user:user._doc._id
            })

            await User.findByIdAndUpdate(
                user._doc._id,
                {cart:cart._doc._id}
                )
            }
            

            return res.status(200).send("User created successfully")
        }
        catch(e){
            console.log(e);
            return res.status(500).send("User didn't created")
        }
    }
}


export const editUser = {
    validator:(req,res,next)=>{
        if(req.currUser._id.toHexString() !== req.body.userId){
            return res.status(400).send("you cant edit user details")

        }
        if(!req.body.userId){
            return res.status(400).send("Pass userId in body")
        }
        if(!req.body.username || !req.body.email || !req.body.phone || !req.body.avatar ){
            return res.status(400).send("Pass some information to update")
        }
        next()
    },
    controller:async(req,res)=>{
        try{
            const user = await User.findByIdAndUpdate(req.body.userId,{username:req.body.username ,email : req.body.email,phone :  req.body.phone,avatar:  req.body.avatar})

            return res.send("User details updated successfully")
        }
        catch(e){
            if(e.codeName === "DuplicateKey"){
                return res.status(400).send("Username already exists")
            }
            return res.status(500).send(e)
        }
    }
}

export const addToCart = {
    validator:(req,res,next)=>{
        if(!req.body.productId || !req.body.qty){
            return res.status(400).send("please pass product id and quantity ")
        }

        if(!mongoose.isValidObjectId(req.body.productId)){
            return res.status(400).send("Please pass valid productId in query")
        }
        next()
    },
    controller:async(req,res)=>{

        try{

            const {productID,qty} = req.body;
            const cart = await Cart.findByIdAndUpdate(req.currUser.cart,{$push:{items:{product:productID,qty}}})
            return res.status(200).send(cart)
        }
        catch(e){
            return res.status(500).send("product not added in cart")
        }


    }
}

export const updateCart = {
    validator:(req,res,next)=>{
        if(!req.body.productId || !req.body.qty){
            return res.status(400).send("please pass product id and quantity ")
        }

        if(!mongoose.isValidObjectId(req.body.productId)){
            return res.status(400).send("Please pass valid productId in query")
        }
        next()
    },
    controller:async(req,res)=>{
        try{
            const {productID,qty} = req.body;
            const cart = await Cart.updateOne({_id:req.currUser.cart,"items.product":productID},{$set:{"items.$.qty":qty}})
            return res.status(200).send(cart)   
        }
        catch(e){
            return res.status(500).send("product not added in cart")
        }

    }
}