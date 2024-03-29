import Mongoose from "mongoose";
import { ObjectId } from "mongoose";


const ProductSchema = Mongoose.Schema({
   name:{
    type:String,
    required:true,
   },
   description:{
    type:String,
    required:true
   },
   imgs:{
    type:String,
    default:"https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"
   },
   doc:{
      type:String,
   },
   seller:{
    type:ObjectId,
    ref:"User",
    required:true,
   },
   type:{
    type:String,
    enum:["artwork","collectables"],
    required:true,
   },
   category:{
    type:String,
    enum:["comics","history","sports","autographs","toys","coins","paintings","other","clocks","furniture","photography","sculptures"],
   },
   price:{
    type:Number,
    required:true
   },
   isAvailable:{
    type:Boolean,
    default:true
   },
   isApproved:{
      type:Boolean,
    default:false
   },
   isDeleted:{
      type:Boolean,
      default:false
   }
},{timestamps:true}
)


const Product = Mongoose.model("Product",ProductSchema);
export default Product;