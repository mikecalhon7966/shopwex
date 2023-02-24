import mongoose from "mongoose";
import User from "../models/user.model.js";
import categoryModel from "../models/categories.model.js";
import productModel from "../models/products.model.js";
import settingsModel from "../models/settings.model.js";
import OrderModel from "../models/orders.model.js";
import sliderModel from "../models/slider.model.js";
import csv from 'fast-csv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'trentjoe7966@gmail.com',
      pass: 'vjirjipfjwsrxqnh'
    }
  });




export const dashboard = async (req,res)=>{
    res.locals = {  title: 'Dashboard' };
    let user = req.session.user;

    

    res.render('Dashboard/dashboard',{user:user});
}

export const categories = async (req,res)=>{
    res.locals = {  title: 'Categories' };
    let user = req.session.user;
    const categories = await categoryModel.find().sort({_id:-1});
    
    res.render('Categories/list',{user:user,categories:categories});
}
export const categoryAdd = async (req,res)=>{
    res.locals = {  title: 'Add Category' };
    let user = req.session.user;
    res.render('Categories/form',{user:user});
}
export const categoryEdit = async (req,res)=>{
    res.locals = {  title: 'Edit Category' };
    let id = req.query.id;
    if(!mongoose.Types.ObjectId.isValid(id)){ 
        return res.redirect('/categories');
    } ;
    const category = await categoryModel.findById(id);

    let user = req.session.user;
    res.render('Categories/form',{user:user,category:category});
}
export const categorySave = async (req,res)=>{
    let bannerDb = ''
    if(req.files){
        let banner = req.files.banner;
        var file_name = new Date().getTime() +'_'+banner.name;
        bannerDb = '/public/uploads/'+ file_name;
        banner.mv('./public/uploads/'+ file_name);

    }
    if(req.body._id){
        let _id = req.body._id;
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.redirect('/categories');;
        await categoryModel.findByIdAndUpdate(_id,
            {
            title: req.body.title,
            banner:bannerDb,
            }, {new:true});
    }else{
        const newCategory = new categoryModel({
            title: req.body.title,
            banner:bannerDb,
            createdAt:new Date().toISOString()
           });
       await newCategory.save();
    }
    res.redirect('/categories');
}
export const categoryDelete = async (req,res)=>{
    
    let id = req.query.id;
    if(!mongoose.Types.ObjectId.isValid(id)){ 
        return res.redirect('/categories');
    } ;
    const category = await categoryModel.findById(id);
    await categoryModel.findByIdAndDelete(id);
    res.redirect('/categories');
}

// Products

export const products = async (req,res)=>{
    res.locals = {  title: 'Products' };
    let user = req.session.user;
    const products = await productModel.find().sort({_id:-1});
    res.render('Products/list',{user:user,products:products});
}
export const productAdd = async (req,res)=>{
    res.locals = {  title: 'Add Product' };
    let user = req.session.user;
    const categories = await categoryModel.find().sort({_id:-1});
    res.render('Products/form',{user:user,categories:categories});
}
export const productEdit = async (req,res)=>{
    res.locals = {  title: 'Edit Product' };
    let id = req.query.id;
    if(!mongoose.Types.ObjectId.isValid(id)){ 
        return res.redirect('/products');
    } ;
    const product = await productModel.findById(id);
    const categories = await categoryModel.find().sort({_id:-1});
    console.log(product);
    let user = req.session.user;
    res.render('Products/form',{user:user,product:product,categories:categories});
}
export const productSave = async (req,res)=>{
    let thumbnailDb = ''
    if(req.files){
        let thumbnail = req.files.thumbnail;
        var file_name = new Date().getTime() +'_'+thumbnail.name;
        thumbnailDb = '/public/uploads/'+ file_name;
        thumbnail.mv('./public/uploads/'+ file_name);
    }

    if(req.body._id){
        let _id = req.body._id;
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.redirect('/products');
        let obj =  {
            title: req.body.title,
            category_ids:[req.body.category_ids],
            item_no:req.body.item_no,
            price:req.body.price,
            inventory:req.body.inventory,
            short_description:req.body.short_description,
            };
        if(thumbnailDb != ''){ obj = {...obj,thumbnail:thumbnailDb,}  }
        await productModel.findByIdAndUpdate(_id,obj, {new:true});
    }else{
        const newProduct = new productModel({
            title: req.body.title,
            category_ids:[req.body.category_ids],
            thumbnail:thumbnailDb,
            item_no:req.body.item_no,
            price:req.body.price,
            inventory:req.body.inventory,
            short_description:req.body.short_description,
            createdAt:new Date().toISOString()
           });
       await newProduct.save();
    }
    res.redirect('/products');
}
export const productDelete = async (req,res)=>{
    
    let id = req.query.id;
    if(!mongoose.Types.ObjectId.isValid(id)){ 
        return res.redirect('/products');
    } ;
    const category = await productModel.findById(id);
    await productModel.findByIdAndDelete(id);
    res.redirect('/products');
}

// Settings

export const settings = async (req,res)=>{
    res.locals = {  title: 'Settings' };
    let user = req.session.user;
    const settings = await settingsModel.find().sort({_id:-1});
    res.render('Settings/list',{user:user,settings:settings});
}
export const settingEdit = async (req,res)=>{
    res.locals = {  title: 'Edit Settings' };
    let id = req.query.id;
    if(!mongoose.Types.ObjectId.isValid(id)){ 
        return res.redirect('/settings');
    } ;
    const setting = await settingsModel.findById(id);

    let user = req.session.user;
    res.render('Settings/form',{user:user,cmsSettings:setting});
}
export const settingAdd = async (req,res) => {
    res.locals = {  title: 'Settings' };
    res.render('Settings/form');
}
export const settingSave = async (req,res)=>{
    let bannerDb = ''
    let overlayDb = ''
    if(req.files){
        if(req.files.banner){
            let banner = req.files.banner;
            var file_name = new Date().getTime() +'_'+banner.name;
            bannerDb = '/public/uploads/'+ file_name;
            banner.mv('./public/uploads/'+ file_name);      
        }
        if(req.files.banner_overlay){
            let bannerOverlay = req.files.banner_overlay;
            var file_name = new Date().getTime() +'_'+bannerOverlay.name;
            overlayDb = '/public/uploads/'+ file_name;
            bannerOverlay.mv('./public/uploads/'+ file_name);      
        }
    }
    let obj = {
        key:req.body.key,
        value: {
            link : req.body.key,
            banner : '',
            banner_overlay : ''
        },
    }
    if(bannerDb !== ''){
        obj.value.banner = bannerDb;
    }
    if(overlayDb !== ''){
        obj.value.banner_overlay = overlayDb;
    }
    

    if(req.body._id){
        let _id = req.body._id;
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.redirect('/settings');
        await settingsModel.findByIdAndUpdate(_id,obj, {new:true});
    }else{
        obj.createdAt = new Date().toISOString();
        const newSetting = new settingsModel(obj);
       await newSetting.save();
    }
    res.redirect('/settings');
    return;
}

export const orders = async (req,res)=>{
    res.locals = {  title: 'Orders' };
    let user = req.session.user;
    const orders = await OrderModel.find().sort({_id:-1});
    
    res.render('Orders/list',{user:user,orders:orders});
}

export const orderView = async (req,res)=>{
    res.locals = {  title: 'View Orders' };
    let id = req.query.id;
    if(!mongoose.Types.ObjectId.isValid(id)){ 
        return res.redirect('/orders');
    } ;
    const order = await OrderModel.findById(id);
    let products = [];
    await Promise.all(order.products.map( async (product)=>{
        let getProductById = await productModel.findById(product.product_id);
        if(getProductById){
            let productItem = {
                quantity:product.quantity,
                price:product.Price,
                product:getProductById
            }
            products.push(productItem);
          }
        
    }));
    let user = req.session.user;
    console.log(products);
    res.render('Orders/view',{user:user,order:order,products:products});
}



export const users = async (req,res)=>{
    res.locals = {  title: 'Users' };
    let user = req.session.user;
    const users = await User.find().sort({_id:-1});
    console.log(users);
    res.render('Users/list',{user:user,users:users});
}
export const editUser = async (req,res)=>{
    res.locals = {  title: 'Edit User' };
    
    let id = req.query.id;
    if(!mongoose.Types.ObjectId.isValid(id)){ 
        return res.redirect('/users');
    } ;
    const userDetails = await User.findById(id);

    let user = req.session.user;
    res.render('Users/form',{user:user,userDetails:userDetails});

}
export const BlockUser = async (req,res)=>{
    let _id = req.query.id;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.redirect('/users');
    await User.findByIdAndUpdate(_id,{ status:0 }, {new:true});
    return res.redirect('/users');
}

export const UnBlockUser = async (req,res)=>{
    let _id = req.query.id;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.redirect('/users');
    await User.findByIdAndUpdate(_id,{ status:1 }, {new:true});
    return res.redirect('/users');
}
export const saveUser = async (req,res)=>{
    const {_id,name,email,phone,business_name,business_address} = req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.redirect('/users');
    const userData = {
        email,       
        name:name,
        phone:phone,
        business_name,
        business_address
    };
    await User.findByIdAndUpdate(_id,userData, {new:true});
    return res.redirect('/users');
}
export const productCsv = async (req,res) => {
    let csvDb = ''
    if(req.files){
        let csvFile = req.files.csv;
        csvDb = 'public/uploads/'+ csvFile.name;
        await csvFile.mv('./public/uploads/'+ csvFile.name);
        const data = [];


        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        var csvPath = path.join(__dirname, "../")+csvDb;
           fs.createReadStream(csvPath).pipe(csv.parse({headers:false}))
        .on('error', error => console.error(error))
        .on('data', async row => {        
            data.push(row);
            let product = await productModel.find({item_no: row[0]});
            if(product.length == 1){
                let obj = { price : row[3],inventory:parseInt(row[2]) };
                let update = await productModel.findByIdAndUpdate(product[0]._id,obj, {new:true});
                console.log(update);
            }
        })
        .on('end', () => console.log(data));   
       
           
    }
    return res.redirect('/products');
}

export const slider = async (req,res) => {
    res.locals = {  title: 'Slides' };
    let user = req.session.user;
    const slides = await sliderModel.find().sort({_id:-1});

    res.render('Slider/list',{user:user,slides:slides});
    
}
export const sliderAdd = async (req,res) => {
    res.locals = {  title: 'Add Slide' };
    let user = req.session.user;
    res.render('Slider/form',{user:user});
}

export const sliderEdit = async (req,res) => {
    res.locals = {  title: 'Edit Slide' };
    let id = req.query.id;
    if(!mongoose.Types.ObjectId.isValid(id)){ 
        return res.redirect('/slider');
    } ;
    const slide = await sliderModel.findById(id);

    let user = req.session.user;
    res.render('Slider/form',{user:user,slide:slide});
}
export const sliderDelete = async (req,res) => {
    let id = req.query.id;
    if(!mongoose.Types.ObjectId.isValid(id)){ 
        return res.redirect('/slider');
    } ;
    const category = await sliderModel.findById(id);
    await sliderModel.findByIdAndDelete(id);
    res.redirect('/slider');
}
export const sliderSave = async (req,res) => {
    let bannerDb = ''
    if(req.files){
        let banner = req.files.banner;
        var file_name = new Date().getTime() +'_'+banner.name;
        bannerDb = '/public/uploads/'+ file_name;
        banner.mv('./public/uploads/'+ file_name);
    }
    if(req.body._id){
        let _id = req.body._id;
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.redirect('/slider');
        let obj =  {
            title: req.body.title,            
            description:req.body.description,
            link:req.body.link,
            };
        if(bannerDb != ''){ obj = {...obj,banner:bannerDb,}  }
        await sliderModel.findByIdAndUpdate(_id,obj, {new:true});
    }else{
        const newSlide = new sliderModel({
            title: req.body.title,            
            description:req.body.description,
            link:req.body.link,
            banner:bannerDb,
            createdAt:new Date().toISOString()
           });
       await newSlide.save();
    }
    res.redirect('/slider');
}