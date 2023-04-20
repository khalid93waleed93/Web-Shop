import { NextFunction, Response,Request } from "express";
import { Product } from "../models/product";
import { UserModel } from "../models/user";
import { validationResult } from "express-validator";
import { deleteFile } from "../util/fileHelper";

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
    const { title, price, description, productId } = req.body;
    const image = req.file;
    
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
            if(image){
                deleteFile(p.imageUrl);
                p.imageUrl= image.path;
            }
            p.description= description;
            await p.save();
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

    const { title, price,description } = req.body;
    const image = req.file
    if(!image){
        return res.status(422).render('admin/edit-product',{ 
            pageTitle:'Add Product',
            path:'/admin/add-product',
            editing: false,
            hasError: true,
            product:{
                title,
                price,
                description,
                
            },
            errorMessage:'Attached file is not an image',
            validationErrors: []
        });
    }
    const imageUrl = image.path;
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
                
            },
            errorMessage:errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    try {
        const product = new Product(title, price, description, imageUrl, req.user._id);
        // const product = new Product(title, price, description, imageUrl, new Schema.Types.ObjectId('111111111111'));
        await product.save();
        res.redirect('/admin/products');
    } catch(err) {
         next(err);
    }
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Product.fetchAll();
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

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (product && product.userId.toString() === req.user.id) {
            // Remove the product from all users' carts
            await UserModel.updateMany(
                {},
                { $pull: { "cart.items": { productId: productId } } }
            );
            // await OrderModel.updateMany(
            //     { "products.product._id": new ObjectId(productId) },
            //     { $pull: { "products": { "product._id": new ObjectId(productId) } } }
            // );
            deleteFile(product.imageUrl)
            await Product.deleteById(productId);
            // console.log('Product deleted');
            res.status(200).json({ message: 'Success!' });
        } else {
            res.status(500).json({ message: 'Deleting product failed.' });
        }
    } catch (err) {
        next(err);
    }
};
