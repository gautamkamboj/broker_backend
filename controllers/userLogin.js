import {User} from "../models/userSchema.js";
import jwt from "jsonwebtoken";

export const userRegister = async(req,res)=>{
    const {username,password} = req.body; 
    
    try{
        const user = await User.create({username,password});
       
        res.status(201).json({message:"user registered sucessfully"});
    }catch(err){
        res.status(500).json({message:"error :", err});
    }
}

export const userLogin = async (req,res)=>{

    const {username,password} = req.body;
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message: "invalid credential"});
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message: "invalid credentials"});
        }

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn: '10h'});
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
}
}

