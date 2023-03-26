import  express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import user from "./routes/user.js";
import product from "./routes/product.js";
import admin from "./routes/admin.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import bodyParser from "body-parser";
const app = express()
dotenv.config()
var whitelist = ['http://localhost:3000',/** other domains if any */ ]
var corsOptions = {
  credentials: true,
  origin: 
  // '*'
  function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))
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