import express from 'express';
import prisma from '../lib/db.js';
import {protectRoute} from '../middleware/auth.middleware.js';

const router=express.Router();

router.post('/add',protectRoute,async(req,res)=>{
    try {
        console.log(req.user);
        const userId=req.user.id;
        if(!userId){
            return res.status(401).json({message:"Unauthorized"})
        }

        const {items}=req.body;
        if(!items || !Array.isArray(items) || items.length === 0){
            return res.status(400).json({message:"Items are required and should be an array"})
        }

    await prisma.$transaction(async (tx) => {

    let cart = await tx.cart.findFirst({
        where: { userId }
    });

    if (!cart) {
        cart = await tx.cart.create({
            data: {
                userId
            }
        });
    }

    for (const item of items) {

        const { productId, quantity } = item;

        if (!productId || !quantity) {
            throw new Error("Product ID and quantity are required");
        }

        const product = await tx.product.findUnique({
            where: {
                id: productId
            }
        });

        if (!product || product.isDeleted) {
            throw new Error("Product not found");
        }

        if (product.stock < quantity) {
            throw new Error("Insufficient stock");
        }

        let cartItem = await tx.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });

        if (cartItem) {

            await tx.cartItem.update({
                where: {
                    id: cartItem.id
                },
                data: {
                    quantity
                }
            });

        } else {

            await tx.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity
                }
            });
        }
    }
});
        return res.status(200).json({message:"Product added to cart successfully"})

    }catch (error) {    
        console.error(error);
        res.status(500).json({ message: 'Server error',error: error.message });   
    }});

    router.get('/',protectRoute,async(req,res)=>{
        try {
            const userId=req.user.id;
            if(!userId){
                return res.status(401).json({message:"Unauthorized"})
            }
            const cart = await prisma.cart.findFirst({
                where: { userId },
                select:{id:true}
            });

            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            const cartItems = await prisma.cartItem.findMany({
                where: { cartId: cart.id },
                include: { product: true }
            });
            cart.items = cartItems;
            res.status(200).json({ cart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

    router.delete('/clear',protectRoute,async(req,res)=>{
        try {
            const userId=req.user.id;
            if(!userId){
                return res.status(401).json({message:"Unauthorized"})
            }   
            const userCartId = await prisma.cart.findFirst({
                where: { userId },
                select:{id:true}
            });
            if(!userCartId){
                return res.status(404).json({message:"Cart not found"})
            }
            await prisma.cartItem.deleteMany({
                where: { cartId: userCartId.id }
            });
            res.status(200).json({message:"Cart cleared successfully"})
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }});


    export default router;