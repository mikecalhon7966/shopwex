import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    title: String,
    banner: String,
    createdAt:{
        type: Date,
        default: new Date(),
    }

});

const categoryModel = mongoose.model('categories',categorySchema);

export default categoryModel;