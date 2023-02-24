import mongoose from "mongoose";

const settingSchema = mongoose.Schema({
    key: String,
    value:{
        banner: String,
        banner_overlay: String,
        link: String,
    },    
    createdAt:{
        type: Date,
        default: new Date(),
    }

});

const SettingModel = mongoose.model('settings',settingSchema);

export default SettingModel;