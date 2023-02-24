import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import User from "../models/user.model.js";



export const login = async (req,res)=>{
    res.locals = {  title: 'Login' };
    let error = '';
    if (req.session.error != ''){
        error = req.session.error;
        req.session.error = '';
    }
    res.render('Auth/login',{error:error});
}
export const adminLogin = async (req,res)=>{

    const {email,password} = req.body;
    try {
        
        
        const existingUser = await User.findOne({email});
      
        if(!existingUser){ 
            req.session.error = "User doesn't exists.";
            res.redirect('/login');
            return;
        }
        const isPasswordCorrect = (existingUser.password == password);
        if(!isPasswordCorrect){ 
            req.session.error = "Invalid credentials";
            res.redirect('/login');
            return;
        }
        const token = jwt.sign({email:existingUser.email,id:existingUser._id},'test',{expiresIn:"10h"}); 
        req.session.IsLoggedIn = true;
        req.session.token = token;
        req.session.user = existingUser;
        res.redirect('/dashboard');
        return;
   

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const logout = async (req,res) =>{
    req.session.destroy((err) => {
        res.redirect('/') // will always fire after session is destroyed
      })
}


export const signIn = async (req,res)=>{
    const {email,password} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(!existingUser){ res.status(404).json({ message: "User doesn't exists." }); return; }
        if(existingUser.status == 0){ res.status(400).json({ message: "Please wait for admin verification." }); return; }
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
        if(!isPasswordCorrect){ res.status(400).json({ message: "Invalid credentials" });  return;}
        const token = jwt.sign({email:existingUser.email,id:existingUser._id},'test',{expiresIn:"10h"});
        res.status(200).json({result:existingUser,token});  return; 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const signUp = async (req,res)=>{
    
    const {name,email,password,confirmPassword,phone,business_name,business_address} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){ res.status(400).json({ message: "User already exists." }); return; }
        if(password !== confirmPassword) {res.status(400).json({ message: "Passwords not matched" }); return;}
        const hashedPassword = await bcrypt.hash(password,12);
        const userData = {
            email,
            password:hashedPassword,
            name:name,
            phone:phone,
            business_name,
            business_address,
            status:0
        };

        const result = await User.create(userData);
        const token = jwt.sign({email:email,id:result._id},'test',{expiresIn:"10h"});
        res.status(200).json({result,token});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const forgetPassword = async (req,res)=>{
    const {email} = req.body;
    try{
        
        const existingUser = await User.findOne({email});
        if(existingUser){ res.status(400).json({ message: "User already exists." }); return; }
        

    }catch (error) {
        res.status(400).json({ message: error.message });
    }
}
