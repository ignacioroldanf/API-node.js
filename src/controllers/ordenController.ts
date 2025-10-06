import { Orden } from "../models/ordenModel";
import { Request, Response } from "express";
import Product from '../models/productModel'
import { getSystemErrorMap } from "util";

export const getOrden = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const orden = await Orden.findOne({ userId}).populate('productos.productId');
        if (!orden){
            return res.status(404).json({message: "Orden no encontrada"});
        }
        res.status(200).json(orden)
        
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la orden', error});
    }
}

export const addProductToOrden = async(req: Request, res: Response) =>{
    try {
        const userId = req.params.userId;
        const {productId, cantidad} = req.body;
        const product = await Product.findById(productId);
        if (!product){
            return res.status(404).json({ message: 'Producto no encontrado'});
        }

        let orden = await Orden.findOne({userId});

        if(!orden){
            orden = new Orden({ userId, productos: [], precioTotal: 0, fecha: Date.now()});
        }

        const productoExistente = orden.productos.find(product => product.productId.toString()=== productId);

        if (productoExistente){
            productoExistente.cantidad += cantidad;
        } else{
            orden.productos.push({ productId, cantidad, precio: product.price, nombre: product.name})
        }

        orden.precioTotal += product.price * cantidad;
        await orden.save();
        res.status(200).json(orden);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto a la orden', error});
    }
}


export const updateOrden = async(req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const {productId, cantidad} = req.body;
        const product = await Product.findById(productId);

        if (!product){
            return res.status(404).json({ message: 'Producto no encontrado'});
        }
        
        let orden = await Orden.findOne({userId});

        if(!orden){
            return res.status(404).json({message: 'Orden no encontrada'});
        }

        const productoExistente = orden.productos.find(product => product.productId.toString()=== productId);
        if(!productoExistente){
            return res.status(404).json({ message: 'Producto no encontrado en el carrito'});
        }
        productoExistente.cantidad = cantidad;
        orden.precioTotal = orden.productos.reduce((total, product) => total + product.precio * product.cantidad, 0);
        await orden.save();
        res.status(200).json(orden);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto en la orden', error});
    }
}

export const removeProductFromOrden = async(req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const { productId} = req.body;
        let orden = await Orden.findOne({ userId});
        if(!orden){
            return res.status(404).json({ message: 'Orden no encontrada'});
        }
        const productIndex = orden.productos.findIndex( product => product.productId.toString() === productId);
        if(productIndex === -1){
            return res.status(404).json({ message: 'Producto no encontrado en la orden'});
        }
        const product = orden.productos[productIndex];
        orden.precioTotal -= product.precio * product.cantidad;
        orden.productos.splice(productIndex, 1);
        await orden.save();
        res.status(200).json(orden);
    } catch (error) {
        res.status(500).json({ message: ' Error al eliminar el producto de la orden',error});
    }
}