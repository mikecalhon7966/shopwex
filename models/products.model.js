import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    title: String,
    item_no: String,
    price: String,
    description:String,
    inventory:Number,
    short_description:String,
    thumbnail: String,
    category_ids: {
        type:[String],
        default: []
    },
    createdAt:{
        type: Date,
        default: new Date(),
    }

});

const productModel = mongoose.model('products',productSchema);

export default productModel;