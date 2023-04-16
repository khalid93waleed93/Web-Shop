import { NextFunction, Response,Request } from "express";
import { Product } from "../models/product";
import { UserModel } from "../models/user";
import { OrderModel } from "../models/order";
import { ObjectId } from "mongodb";
import { validationResult } from "express-validator";
import { log } from "console";
import { Schema } from "mongoose";

export const getAddProduct = (req: Request, res: Response, next: NextFunction) => { 
    res.render('admin/edit-product',{ 
        pageTitle:'Add Product',
        path:'/admin/add-product',
        editing: false,
        hasError:false,
        errorMessage:'',
        validationErrors:[]
    });
}
export const getEditProduct = async (req: Request, res: Response, next: NextFunction) => {
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    try {
        const result = await Product.findById(prodId);
        if(result){ 
            res.render('admin/edit-product',{
                pageTitle: result.title,
                path:'admin/edit-product',
                product: result,
                editing:editMode,
                hasError:false,
                errorMessage:'',
                validationErrors:[]


            });
        } else {
            res.status(404).render('404',{pageTitle:'Page not found', path:req.url});
        }
    } catch(err) {
        next(err);
    }
}

export const postEditProduct = async (req: Request, res: Response, next: NextFunction) => {
    // const inputVal = req.body.price;
    // if ((req.body) && (isNaN(parseFloat(inputVal)) || parseFloat(inputVal) < 0 || inputVal.includes(".") && inputVal.split(".")[1].length > 2)) {
    //     return res.status(400).json({error: "Invalid price value"});
    // }
    const { title, price, description, imageUrl, productId } = req.body;
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product',{ 
            pageTitle:'Edit Product',
            path:'/admin/edit-product',
            editing: true,
            hasError: true,
            product:{
                title,
                price,
                description,
                imageUrl,
                _id:productId
            },
            errorMessage:errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    try {
        const p = await Product.findById(productId);
        if(p && p.userId.toString() === req.user.id){
            p.title= title;
            p.price= price;
            p.imageUrl= imageUrl;
            p.description= description;
            await p.save();
            // console.log('updated product');
            res.redirect('/admin/products');
        }else {
            return res.redirect('/');
        }
    } catch(err) {
        next(err);
    }
}

export const postAddProduct = async (req: Request, res: Response, next: NextFunction) => {
    // const inputVal = req.body.price;
    // if ((req.body) && (isNaN(parseFloat(inputVal)) || parseFloat(inputVal) < 0 || inputVal.includes(".") && inputVal.split(".")[1].length > 2)) {
    //     return res.status(400).json({error: "Invalid price value"});
    // }

    const { title, price, imageUrl,description } = req.body;
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product',{ 
            pageTitle:'Add Product',
            path:'/admin/add-product',
            editing: false,
            hasError: true,
            product:{
                title,
                price,
                description,
                imageUrl
            },
            errorMessage:errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    try {
        const product = new Product(title, price, description, imageUrl, req.user!._id);
        // const product = new Product(title, price, description, imageUrl, new Schema.Types.ObjectId('111111111111'));
        await product.save();
        console.log('added product');
        res.redirect('/admin/products');
    } catch(err) {
        // console.log(err);
        // const error = new Error(err);
        return next(err);
    }
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Product.fetchAll(next);
        const filteredResult = result!.filter(e => e.userId.toString() === req.user.id);
        res.render('admin/products', {
            prods:filteredResult,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            isAuthenticated: req.session.isLoggedIn
        });
    } catch(err) {
        next(err);
    }
}

export const postDeleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.body.productId;
    try {
        const product = await Product.findById(productId);
        if (product && product.userId.toString() === req.user.id) {
            // Remove the product from all users' carts
            await UserModel.updateMany(
                {},
                { $pull: { "cart.items": { productId: productId } } }
            );
            await OrderModel.updateMany(
                { "products.product._id": new ObjectId(productId) },
                { $pull: { "products": { "product._id": new ObjectId(productId) } } }
            );
            await Product.deleteById(productId);
            console.log('Product deleted');
            res.redirect('/admin/products');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        next(err);
    }
};
