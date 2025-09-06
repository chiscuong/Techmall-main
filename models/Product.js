import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref:"user"},
    name:{type: String, required: true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    offerPrice:{type: Number,required:true},
    image:{type: Array,required:true},
    category:{type:String,required:true},
    colors: {
        type: [{
            name: {type: String, required: true},
            value: {type: String, required: true}
        }],
        default: []
    },
    date: {type:Number,required:true}
})
const Product = mongoose.models.product || mongoose.model('product',productSchema)

export default Product