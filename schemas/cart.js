import Mongoose from "mongoose";
import { ObjectId } from "mongoose";

const CartSchema = Mongoose.Schema(
  {
    items: [
      {
        product: {
          type: ObjectId,
          ref:"Product",
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
    }
  },
  { timestamps: true }
);

const Cart = Mongoose.model("cart", CartSchema);
export default Cart;
