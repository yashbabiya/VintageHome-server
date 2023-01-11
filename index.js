import  express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import user from "./routes/user.js";
import product from "./routes/product.js";
import admin from "./routes/admin.js"
import cookieParser from "cookie-parser";

import bodyParser from "body-parser";
const app = express()
dotenv.config()


app.use(cookieParser());
app.use(bodyParser.json())


app.use('/user',user)
app.use('/product',product)
app.use('/admin',admin)








// mongoose.set('strictQuery',false)
mongoose.connect(process.env.DB_CONN, {
   useNewUrlParser: true,
   useUnifiedTopology: true
}).then(()=>{
    console.log("✅ DB Connected ✅");

}).catch((e)=>{
    console.log("🚫 Cannot connect to DB  🚫",e);
})
app.listen(5000,()=>{
    console.log("App is running at port 5000 🚀 ... ");
})