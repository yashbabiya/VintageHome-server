import Mongoose from "mongoose";
import { ObjectId } from "mongoose";


const UserSchema = Mongoose.Schema({
   username:{
    type:String,
    required:true,
    unique:true
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
   role:{
    type:String,
    enum:["BUYER","ADMIN","SELLER"],
    required:true,
   },
   cart:{
    type:ObjectId
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