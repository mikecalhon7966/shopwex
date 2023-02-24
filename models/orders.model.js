import mongoose from "mongoose";

const ordersSchema = mongoose.Schema({
    customer: {
        _id:String,
        name: {type:String,required:true},
        email: {type:String,required:true},
        phone: {type:String,required:true},
        status:{type:String, default:'1'},
        business_name:{type:String},
        business_address:{type:String},
    },
    products: [
        { product_id:String,quantity:Number,Price:String }
    ],
    total:{type:String,required:true},
    type:{type:String,required:true},
    createdAt:{
        type: Date,
        default: new Date(),
    }

});

const OrderModel = mongoose.model('orders',ordersSchema);

export default OrderModel;