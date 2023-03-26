import Mongoose from "mongoose";
import { ObjectId } from "mongoose";

const DealSchema = Mongoose.Schema(
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
    },
    seller:{
        type:ObjectId,
        ref:"User"
    },
    paymentDate:{
        type:Date,
        default:new Date()
    },
    orderConfirmDate:{
        type:Date
    },
    orderDepartedDate:{
        type:Date
    },
    orderPlacedDate:{
        type:Date
    },
    rejectDate:{
      type:Date
    }
  },
  { timestamps: true }
);

const Deal = Mongoose.model("deal", DealSchema);
export default Deal;
