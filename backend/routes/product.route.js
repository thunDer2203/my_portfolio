import express from 'express';
import prisma from '../lib/db.js';
import {protectRoute,AssignRole} from '../middleware/auth.middleware.js';
import { parse } from 'dotenv';


const router=express.Router();

router.post('/add/:id',protectRoute,AssignRole,async(req,res)=>{
    try {
        if(req.userRole!=="admin"){
            return res.status(403).json("Forbidden: Only admins can add products")
        }
        const {name,description,price,stock}=req.body;
        const id=parseInt(req.params.id);
        if(id){
            console.log("Product ID provided:", id);
        const existingProduct=await prisma.product.findUnique({where:{id}});
        if(!stock || stock<0){
            return res.status(400).json({message:"Stock is required and cannot be negative"})
        }
        if(existingProduct){
            existingProduct.isDeleted=false;
            existingProduct.price=price?price:existingProduct.price;
            existingProduct.stock=stock;
            const updatedProduct=await prisma.product.update({where:{id:existingProduct.id},data:existingProduct})
            return res.status(200).json({message:"Product already exists. Reactivated the existing product.",product:updatedProduct})
        }
    }
        if(!name || !description || !price){
            return res.status(400).json({message:"All fields are required"})
        }
        
        const newProduct=await prisma.product.create({
            data:{
                name,
                description,
                price,
                stock
            }
        })
        res.status(201).json({message:"Product added successfully",product:newProduct})
    }catch (error) { 
        res.status(500).json({ message: 'Server error' });   
    console.error(error);   
}
});

router.put('/update/:id',protectRoute,AssignRole,async(req,res)=>{
    try {
        // console.log(req);
        if(req.userRole!=="admin"){
            return res.status(403).json("Forbidden: Only admins can update products")
        }
        const productId=parseInt(req.params.id);
        const{price,stock}=req.body;
        if(price===undefined && stock===undefined){
            return res.status(400).json({message:"At least one field (price or stock) is required for update"})
        }
        if(price!==undefined && price<=0){
            return res.status(400).json({message:"Price must be greater than zero"})
        }
        if(stock!==undefined && stock<0){
            return res.status(400).json({message:"Stock cannot be negative"})
        }
        const product=await prisma.product.findUnique({where:{id:productId}});
        if(!product || product.isDeleted){
            return res.status(404).json({message:"Product not found"})
        }
        if(price!==undefined){
            product.price=price;
        }
        if(stock!==undefined){
            product.stock=stock;
        }
        const updatedProduct=await prisma.product.update({
            where:{id:productId},
            data:product
        })
        res.status(200).json({message:"Product updated successfully",product:updatedProduct})
    }catch (error) {
        res.status(500).json({ message: 'Server error' });   
    console.error(error);   
}});

router.delete('/delete/:id',protectRoute,AssignRole,async(req,res)=>{
    try {
        if(req.userRole!=="admin"){
            return res.status(403).json("Forbidden: Only admins can delete products")
        }
        const productId=parseInt(req.params.id);
        const product =await prisma.product.findUnique({where:{id:productId}});
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        product.isDeleted=true;
        const stock=product.stock;
        product.stock=0;
        const deletedProduct = await prisma.product.update({where:{id:productId}, data: product});
        res.status(200).json({message:"Product deleted successfully", product: deletedProduct,stockBeforeDeletion:stock})
    }catch (error) {
        res.status(500).json({ message: 'Server error' });   
    console.error(error);   
}});

export default router;
