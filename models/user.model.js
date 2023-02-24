import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type:String,required:true},
    email: {type:String,required:true},
    phone: {type:String,required:true},
    password: {type:String, required:true},
    type:{type:String, default:'1'},
    status:{type:String, default:'0'},
    business_name:{type:String},
    business_address:{type:String},
    // imageUrl: {type:String},
    id:{ type:String}
});

const postMessage = mongoose.model('users',userSchema);

export default postMessage;