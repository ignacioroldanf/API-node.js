import { Schema, model } from "mongoose";
import { ref } from "process";

const ordenItemSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        cantidad:{
            type: Number,
            required: true
        },
        precio:{
            type: Number,
            required: true
        },
    });

const ordenSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productos: [ordenItemSchema],
    precioTotal:{
        type: Number,
        required: true
    },
    fecha:{
        type: Date
    }
});

export const Orden =  model("ordenSchema", ordenSchema)