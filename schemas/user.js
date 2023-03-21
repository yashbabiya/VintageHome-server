import Mongoose from "mongoose";
import { ObjectId } from "mongoose";


const UserSchema = Mongoose.Schema({
   username:{
    type:String,
    required:true,
    unique:true
   },
   firstname:{
    type:String
   },
   lastname:{
    type:String
   },
   password:{
    type:String,
    required:true
   },
   avatar:{
    type:String,
    default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
   },
   email:{
    type:String,
    required:true,
    unique:true
   },
   phone:{
    type:String,
    required:true,
   },
   address:{
    type:String
   },
   city:{
    type:String
   },
   state:{
    type:String
   },
   pincode:{
    type:Number
   },
   role:{
    type:String,
    enum:["BUYER","ADMIN","SELLER"],
    required:true,
   },
   cart:{
    type:ObjectId,
    ref:"cart"
   },
   deals:{
    type:Array
   },
   bankDetails:{
    accountno:{
        type:String
    }
   },
   products:{
    type:Array
   },
   isBanned:{
    type:Boolean,
    default:false
   }
},{timestamps:true}
)


const User = Mongoose.model("User",UserSchema);
export default User;