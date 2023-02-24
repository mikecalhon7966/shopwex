import mongoose from "mongoose";

const sliderSchema = mongoose.Schema({
    title: String,
    description: String,
    link: String,
    banner: String,
    createdAt:{
        type: Date,
        default: new Date(),
    }

});

const sliderModel = mongoose.model('slider',sliderSchema);

export default sliderModel;