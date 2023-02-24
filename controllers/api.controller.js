import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import categoryModel from "../models/categories.model.js";
import productModel from "../models/products.model.js";
import settingsModel from "../models/settings.model.js";
import sliderModel from '../models/slider.model.js';
import OrderModel from "../models/orders.model.js";
import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'trentjoe7966@gmail.com',
      pass: 'vjirjipfjwsrxqnh'
    }
  });


export const homePageSection = async (req,res)=>{
    const {page} = req.query;

try {
    const settings = await settingsModel.find().sort({_id:-1});
    res.status(200).json({
        data:settings,
    });
} catch (error) {
    res.status(400).json({ message: error.message });
}
};

export const homePageSlides = async (req,res)=>{
try {
    const slides = await sliderModel.find().sort({_id:-1});
    res.status(200).json({
        data:slides,
    });
} catch (error) {
    res.status(400).json({ message: error.message });
}
};


export const getCategories = async (req,res)=>{
    try {
        const categories = await categoryModel.find().sort({_id:-1});
        res.status(200).json({
            data:categories,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getCategoryById = async (req,res)=>{
    const { id } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No product with that id');
        const product = await categoryModel.findById(id);
        res.status(200).json({ data:product });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}



export const getProducts = async (req,res)=>{
    const {page} = req.query;

try {
    const LIMIT = 800;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await productModel.countDocuments({});

    // const products = await productModel.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);
    const products = await productModel.find().sort({_id:-1});
    res.status(200).json({
        data:products,
        currentPage:Number(page),
        numberOfPages:Math.ceil(total/LIMIT)
    });
} catch (error) {
    res.status(400).json({ message: error.message });
}
};

export const getProductById = async (req,res)=>{
    const { id } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No product with that id');
        const product = await productModel.findById(id);
        res.status(200).json({ data:product });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


export const getByCategories = async (req,res)=>{
    const {page} = req.query;
    const {categoryIds} = req.body;
try {
    const products = await productModel.find().where('category_ids').in(categoryIds);
    res.status(200).json({
        data:products,
        currentPage:1,
        numberOfPages:1
    });
} catch (error) {
    res.status(400).json({ message: error.message });
}
}


export const getProductsByCategories = async (req,res)=>{
    const {page} = req.query;
    const {categoryIds} = req.body;
try {
    const LIMIT = 800;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await productModel.find().sort({_id:-1}).where('category_ids').in(categoryIds).countDocuments({});

    // const products = await productModel.find().sort({_id:-1}).where('category_ids').in(categoryIds).limit(LIMIT).skip(startIndex);
    const products = await productModel.find().where('category_ids').in(categoryIds);
    res.status(200).json({
        data:products,
        currentPage:Number(page),
        numberOfPages:Math.ceil(total/LIMIT)
    });
} catch (error) {
    res.status(400).json({ message: error.message });
}
};

export const getProductBySearch = async (req,res)=>{
    const {searchQuery} = req.query;
    try {
        const title = new RegExp(searchQuery,'i');
       const product = await productModel.find({ $or : [ { title } ] });

        res.status(200).json({ data:product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getTopProducts = async (req,res) => {
    // const products = await productModel.find().sort({_id:-1}).limit(LIMIT);
    const products = await productModel.aggregate([
        { $sample: { size: 6 } },
     ]);;
    res.status(200).json({
        data:products,
    });
}

export const placeOrder = async (req,res) => {
    const order = req.body;
    const newOrder = new OrderModel({...order,creator:req.userId, createdAt:new Date().toISOString()});
    try {
        let html = '</!DOCTYPE html><html><head><meta charset="utf-8"><meta http -equiv="X-UA-Compatible" content="IE=8; IE=edge,chrome=1"></head> ';
        html += "<h3>Order Details</h3>";
        html += '<table border="1" style="border-collapse: collapse;">';
            html += '<tr>';
                html += '<th style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += 'Customer Name';
                html += '</th>';
                html += '<td style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += newOrder.customer.name;
                html += '</td>';
            html += '</tr>';

            html += '<tr>';
                html += '<th style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += 'Customer Email';
                html += '</th>';
                html += '<td style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += newOrder.customer.email;
                html += '</td>';
            html += '</tr>';

            html += '<tr>';
                html += '<th style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += 'Customer Phone';
                html += '</th>';
                html += '<td style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += newOrder.customer.phone;
                html += '</td>';
            html += '</tr>';

            html += '<tr>';
                html += '<th style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += 'Business Name';
                html += '</th>';
                html += '<td style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += newOrder.customer.business_name;
                html += '</td>';
            html += '</tr>';

            html += '<tr>';
                html += '<th style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += 'Business Address';
                html += '</th>';
                html += '<td style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += newOrder.customer.business_address;
                html += '</td>';
            html += '</tr>';

            html += '<tr>';
                html += '<th style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += 'Order Type';
                html += '</th>';
                html += '<td style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += newOrder.type;
                html += '</td>';
            html += '</tr>';

            html += '<tr>';
                html += '<th style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += 'Order Total ($)';
                html += '</th>';
                html += '<td style="border-collapse: collapse; padding: 10px; text-align: left;">';
                    html += newOrder.total;
                html += '</td>';
            html += '</tr>';
        html += "</table>";



        html += "<h3>Products</h3>";
        html += '<table border="1" style="border-collapse: collapse;">';
        html += '<tr>';
            html += '<th style="border-collapse: collapse; padding: 10px; text-align: left;">';
                html += 'Name';
            html += '</th>';
            html += '<th style="border-collapse: collapse; padding: 10px; text-align: left;">';
                html += 'Quantity';
            html += '</th>';
            html += '<th style="border-collapse: collapse; padding: 10px; text-align: left;">';
                html += 'Price ($)';
            html += '</th>';
        html += '</tr>'; 
        await Promise.all(newOrder.products.map( async (product)=>{
            let getProductById = await productModel.findById(product.product_id);

            if(getProductById){
                let newProduct = {...getProductById,inventory:getProductById.inventory - product.quantity}
                    await productModel.findByIdAndUpdate(product.product_id,newProduct, {new:true});
                html += '<tr>';    
                    html += '<td style="border-collapse: collapse; padding: 10px; text-align: left;">';
                        html += getProductById.title;
                    html += '</td>';        
                    html += '<td style="border-collapse: collapse; padding: 10px; text-align: left;">';
                        html += product.quantity;
                    html += '</td>';
                    html += '<td style="border-collapse: collapse; padding: 10px; text-align: left;">';
                        html += product.Price;
                    html += '</td>';
                html += '</tr>';
            }
            
        }));
        html += "</table>";
        html += "</html>"

        var mailOptions = {
            from: 'trentjoe7966@gmail.com',
            to: 'coordinator.wahab@gmail.com',
            subject: 'A New Order Placed',
            html: html
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          var mailOptions = {
            from: 'trentjoe7966@gmail.com',
            to: 'mushahidahmed76@gmail.com',
            subject: 'A New Order Placed',
            html: html
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });




        await newOrder.save();
        res.status(200).json(newOrder);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const myOrders = async (req,res) => {

    const orders = await OrderModel.find({creator:req.userId});
    res.status(200).json({ data:orders });
}

export const myOrder = async (req,res) => {
    const { id } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Order with that id');
        const order = await OrderModel.findById(id);
       
        let products = [];
        await Promise.all(
            order.products.map( async (product)=>{
                let getProductById = await productModel.findById(product.product_id);
                if(getProductById){
                    let data = {
                        "product":getProductById,
                        "quantity":product.quantity,
                        "price":product.Price
                    }
                    
                    products.push(data);
                }
            })
        );
        let newOrder = {
            "customer":order.customer,
            "products":products,
            "orderDetails": {
                "total":order.total,
                "type":order.type,
                "createdAt":order.createdAt
            }

        }
        res.status(200).json({ data:newOrder });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}