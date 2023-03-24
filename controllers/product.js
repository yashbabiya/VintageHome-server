import mongoose from "mongoose";
import Product from "../schemas/product.js";
import User from "../schemas/user.js";
import Deal from "../schemas/deals.js";


export const searchProduct = {
  validator: (req, res, next) => {
    next();
  },
  controller: async (req, res, next) => {
    try {


      let { page, limit, keyword, category, type} = req.query;

      if (!keyword) {
        keyword = "";
      }

      if (!page) {
        page = 0;
      }
      if (!limit) {
        limit = 10;
      }
      
      
      let queryForSearch1 = {
        $and:[{
            $or: [
              { name: { $regex: keyword, $options: "i" } },
              { description: { $regex: keyword, $options: "i" } },
            ],
          }]
      }

      

      if(category){
        queryForSearch1.$and.push({
            category:category
        })
      }

      if(type){
        queryForSearch1.$and.push({
            type:type
        })
      }
      

      const product = await Product.find(queryForSearch1).populate("seller")
        .skip(page*limit)
        .limit(limit);
      return res.status(200).send(product);
    } catch (e) {
        console.log(e);
      return res.status(500).send(e);
    }
  },
};

export const getAllProduct = {
    controller:async(req, res, next)=>{
        try {
            let { page, limit } = req.query;
      
            if (!page) {
              page = 0;
            }
            if (!limit) {
              limit = 10;
            }
      
            
      
            const product = await Product.find({})
              .skip(page)
              .limit(limit);
      
            return res.status(200).send(product);
          } catch (e) {
            return res.status(500).send(e);
          }
    }
}


export const getProductById = {
    validator:(req,res,next)=>{
        if(!req.query.prodId){
            return res.stauts(400).send("please pass product id in query (prodId)")
        }
        next()
    },
    controller:async(req,res) =>{
        try {
            let { prodId } = req.query;
      
            
      
            
            if(!mongoose.isValidObjectId(prodId)){
                return res.status(400).send("Please pass correct objectid")
            }
      
            const product = await Product.findOne({_id:mongoose.Types.ObjectId( prodId)})
            if(!product){
                return res.status(400).send("Product doesnt exists with that id")
            }
            return res.status(200).send(product);
          } catch (e) {
            return res.status(500).send(e);
          }
    }
}

export const createProduct = {
  validator: (req, res, next) => {
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.price ||
      ! req.body.type ||
      ! req.body.category
    ) {
      return res
        .status(400)
        .send(
          "Pass all information (name, description, type, price, category) "
        );
    }
    if (req.currUser.role !== "SELLER" || req.currUser.isBanned) {
      return res.stauts(400).send("You cant create a product");
    }
    next()
  },
  controller: async (req, res) => {
    try {
      const { name, description, category, price, type, imgs } = req.body;

      const newProduct = {
        name,
        description,
        seller: req.currUser._id,
        category,
        price,
        type,
      };
      if(imgs){
        newProduct["imgs"]=imgs
      }



      const product = await Product.create(newProduct);


      await User.findByIdAndUpdate(req.currUser._id,{$push:{"products":product._id}})

      return res.status(200).send(product);
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }
  },
};


export const updateProduct = {
  validator: (req, res, next) => {
    if (
      !req.body._id ||
      !req.body.name ||
      !req.body.description ||
      !req.body.price ||
      ! req.body.type ||
      ! req.body.category ||
      !req.body.imgs
    ) {
      return res
        .status(400)
        .send(
          "Pass all information (name, description, type, price, category, imgs) to update"
        );
    }
    if ((req.currUser.role !== "SELLER" || req.currUser.isBanned )) {
      return res.status(400).send("You cant edit a product");
    }

    if(!req.currUser.products.find((x)=>x.toHexString() === req.body._id)){
      return res.status(400).send("You are not the seller of this product")
    }



    next()
  },
  controller: async (req, res) => {
    



    try {
      const findProduct = await Product.findById(req.body._id);

      if (!findProduct) {
        return res.status(401).send("Product not found");
      }
      const updateProduct = await Product.findByIdAndUpdate(
        req.body._id,
        {
          name:req.body.name,
          description:req.body.description,
          price:req.body.price,
          type:req.body.type,
          category:req.body.category,
          imgs:req.body.imgs
        },
        { new: true }
      );

      return res.status(200).send("Product Updation Successful");
    } catch (e) {
      return res.status(500).send("Product updation failed");
    }






  }
}


export const deleteProductById = {
    validator:(req,res,next)=>{
        if(req.currUser.role !== "SELLER" && req.currUser.role !== "ADMIN"){
            return res.status(400).send("You cant delete the product")
        }

        if(!req.query.prodId){
            return res.status(400).send("Please pass prodId in query")
        }

        if(req.currUser.role === "SELLER" && !req.currUser.products.find((x)=>x.toHexString() === req.query.prodId)){
            return res.status(400).send("You are not the owner of the product")
        }
        next()
    },
    controller:async(req,res)=>{
        try{
            const {prodId} = req.query
            await User.findByIdAndUpdate(req.currUser._id,{$pull:{products:mongoose.Types.ObjectId( prodId)}})
            await Product.findByIdAndDelete(prodId)
            return res.status(200).send("Product deleted successfully")
        }
        catch(e){
            return res.status(500).send("")
        }
    }
}

export const placeOrder = {
  validator:(req,res,next)=>{
    if(!req.body.items){
      return res.status(400).send("Pass items in body")
    }
    next();
  },
  controller:(req,res)=>{
    try{
      const {items} = req.body;
      const orderForSellers = {}
      items.forEach((item)=>{
        const seller = item?.product.seller
        console.log("deals",orderForSellers)
        if(orderForSellers?.[seller?.toString()]?.length)
        orderForSellers[seller.toString()].push(item);
        else
        orderForSellers[seller.toString()] = [item];
      })
      const sellers = Object.keys(orderForSellers);
      sellers.forEach(async(seller)=>{
        const deal = {
          items:orderForSellers[seller],
          user:req.currUser._id,
          seller
        }
        await Deal.create(deal);
      })
      return res.send("success")
    }
    catch(e){
      return res.status(500).send(e)
    }
  }
}

export const changeOrderStatus = {
  validator:(req,res,next)=>{

    next();
  },
  controller:(req,res)=>{
    try{

    }
    catch(e){
      return res.status(500).send(e)
    }
  }
}

export const getMyOrders = {
  validator:(req,res,next)=>{

    next();
  },
  controller:async(req,res)=>{
    try{
      const orders = await Deal.find({$or:[{user:req.currUser._id},{seller:req.currUser._id}]}).populate("items.product")
      return res.send(orders)
    }
    catch(e){
      return res.status(500).send(e)
    }
  }
}