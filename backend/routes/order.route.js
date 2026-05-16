import express from 'express';
import prisma from '../lib/db.js';
import {protectRoute} from '../middleware/auth.middleware.js';

const router=express.Router();

router.post('/create',protectRoute,async(req,res)=>{
    try {
        const userId=req.user.id;
        const {items}=req.body;

        if(!items || !Array.isArray(items) || items.length === 0){
            return res.status(400).json({message:"Items are required and should be an array"})
        }

        const productIds=items.map(item=>item.productId);
        const products=await prisma.product.findMany({
            where:{id:{in:productIds}}
        })
        let totalPrice=0;

        for(const item of items){
            const product =products.find(p=>p.id===item.productId);
            if(!product){
                return res.status(400).json({message:`Product not found`})
            }

            if(product.stock<item.quantity){
                return res.status(400).json({message:`Insufficient stock for product ${product.name}`})
            }
            if(product.isDeleted){
                return res.status(400).json({message:`Product ${product.name} is not available`})
            }

            totalPrice+=product.price*item.quantity;
        }

            const order=await prisma.$transaction(async (tx)=>{
                const newOrder=await tx.order.create({
                    data:{
                        userId,
                        totalPrice
                    }
                })

                for(const item of items){
                    const product = products.find(
                        p => p.id === item.productId
                    );

                await tx.orderItem.create({
                    data:{
                        orderId:newOrder.id,
                        productId:product.id,
                        quantity:item.quantity,
                        price:product.price
                    }
                });

                await tx.product.update({
                    where:{id:product.id},
                    data:{
                        stock:{
                            decrement:item.quantity
                        }
                    }
                });
                }
                return newOrder;

        });

        return res.status(201).json({message:"Order Place Successfully",orderId:order.id })
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }


})

export default router;