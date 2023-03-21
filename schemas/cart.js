import Mongoose from "mongoose";
import { ObjectId } from "mongoose";

const CartSchema = Mongoose.Schema(
  {
    items: [
      {
        product: {
          type: ObjectId,
          required: true,
        },
        qty: {
          type: Number,
          default: 1,
        },
      },
    ],
    user: {
        type:ObjectId,
        ref:"User",
        required:true
    },
    seller:{
        type:ObjectId
    }
  },
  { timestamps: true }
);

const Cart = Mongoose.model("cart", CartSchema);
export default Cart;
