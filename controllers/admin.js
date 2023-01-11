
import mongoose from "mongoose"
import Product from "../schemas/product.js"
import User from "../schemas/user.js"

export const banUser = {
    validator:(req,res,next)=>{
        if(!req.currUser.type === "ADMIN"){
            return res.status(400).send("You are not a admin")
        }
        if(!req.query.userId){
            return res.status(400).send("Please pass userId in query")
        }
        if(!mongoose.isValidObjectId(req.query.userId)){
            return res.status(400).send("Please pass valid userId in query")
        }
        next()
    },
    controller:async(req,res)=>{
        try{
            await User.findByIdAndUpdate(req.query.userId,{isBanned : true})
            return res.status(200).send("The user is banned")
        }
        catch(e){
            return res.status(500).send("Some error occured")
        }
    }
}

export const viewSellers = {
    validator:(req,res,next)=>{
        if(!req.currUser.type === "ADMIN"){
            return res.status(400).send("You are not a admin")
        }
        next()
    },
    controller:async(req,res)=>{
        try{
            const data = await User.aggregate([
                {$match:{"role":"SELLER"}},
                {$lookup:{
                    from: "products",
                    localField: "products",    // field in the orders collection
                    foreignField: "_id",  // field in the items collection
                    as: "allProducts"
                }},
                {$project: {allProducts:1,username:1,email:1,avatar:1}}
            ])


            return res.send(data)
        }
        catch(e){
            return res.status(500).send("Some error occured")
        }
    }
}

export const approveProduct = {

    validator:(req,res,next)=>{
        if(!req.currUser.type === "ADMIN"){
            return res.status(400).send("You are not a admin")
        }
        if(!req.query.prodId){
            return res.status(400).send("Please pass prodId in query")
        }
        if(!mongoose.isValidObjectId(req.query.prodId)){
            return res.status(400).send("Please pass valid prodId in query")
        }
        next()
    },
    controller:async(req,res)=>{
        try{
            await Product.findByIdAndUpdate(req.query.prodId,{isApproved : true})
            return res.status(200).send("The Product is approved")
        }
        catch(e){
            return res.status(500).send("Some error occured")
        }
    }
}