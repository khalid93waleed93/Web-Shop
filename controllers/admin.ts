import { NextFunction, Response,Request } from "express";
// import { Product } from "../models/product";
import { Product } from "../models/product";
import { log } from "console";
import { UserModel } from "../models/user";
import { OrderModel } from "../models/order";
import { ObjectId } from "mongodb";

export const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
    log(req.session.isLoggedIn) 
    res.render('admin/edit-product',{ 
        pageTitle:'Add Product',
        path:'/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
        
    });
}
export const getEditProduct = (req: Request, res: Response, next: NextFunction) => { 
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then( result =>{
        if(result){ 
            res.render('admin/edit-product',{
                pageTitle: result.title,
                path:'admin/edit-product',
                product: result,
                editing:editMode,
                isAuthenticated: req.session.isLoggedIn
                })
        } else {
            res.status(404).render('404',{pageTitle:'Page not found', path:req.url})
        }
    }).catch((err: Error) => console.log(err));
    
    
}
export const postEditProduct = (req: Request, res: Response, next: NextFunction) => {
    const inputVal = req.body.price;
        // Check if input value is not a positive number with two decimal places
    if ((req.body) && (isNaN(parseFloat(inputVal)) || parseFloat(inputVal) < 0 || inputVal.includes(".") && inputVal.split(".")[1].length > 2)) {
        // If the input value is not valid, send an error response
        return res.status(400).json({error: "Invalid price value"});
    }
    const { title, price, description, imageUrl, productId } = req.body;
    Product.findById(productId)
    .then(p => {
        
        if(p && p.userId.toString() === req.user.id){
            p.title= title;
            p.price= price;
            p.imageUrl= imageUrl;
            p.description= description;
            return p.save()
            .then(result =>{
                // console.log('updated product');
                res.redirect('/admin/products');
            })
        }else {
            return res.redirect('/');
        }
        
    //     const product = new Product(title, price, description, imageUrl, req.user._id)
    // // console.log('11111111111',productId);
    //     product.save()
    })
    
    .catch(err => console.log(err))
}

export const postAddProduct = (req: Request, res: Response, next: NextFunction) => {
    const inputVal = req.body.price;
        // Check if input value is not a positive number with two decimal places
    if ((req.body) && (isNaN(parseFloat(inputVal)) || parseFloat(inputVal) < 0 || inputVal.includes(".") && inputVal.split(".")[1].length > 2)) {
        // If the input value is not valid, send an error response
        return res.status(400).json({error: "Invalid price value"});
    }
//     // console.log('reeeq',req.user);
    const { title, price, imageUrl,description } = req.body;
    const product = new Product(title, price, description, imageUrl, req.user!._id)
    product.save()
   .then(() => {
        console.log('added product');
        res.redirect('/admin/products')
        })
    .catch((err: Error) => {
        console.log( err )
    })
}
export const getProducts = (req: Request, res: Response, next: NextFunction) => {
    Product.fetchAll()
    .then((result) => {
        // log(result)
        const filteredResult = result.filter(e => e.userId.toString() === req.user.id)
        res.render('admin/products', {
            prods:filteredResult,
            // prods:result,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            isAuthenticated: req.session.isLoggedIn
        });
    }).catch((err: Error) => console.log(err))
    
}
export const postDeleteProduct = (req: Request, res: Response, next: NextFunction) => {
    const productId = req.body.productId;
    Product.findById(productId)
    .then(product => {
        if(product && product.userId.toString() === req.user.id) {
            // Remove the product from all users' carts
            UserModel.updateMany(
                {},
                { $pull: { "cart.items": { productId: productId } } }
            )
            .then(result => {
                return OrderModel.updateMany(
                    { "products.product._id":new ObjectId(productId) },
                    { $pull: { "products": { "product._id": new ObjectId(productId) } } }
                    )
            })
            .then(result => {
                console.log('resuuuult',result);
                
                return Product.deleteById(productId);
            })
            .then(result => {
                console.log('result',result);
                res.redirect('/admin/products')
            })
            .catch(err => console.log(err));

        } else {
            res.redirect('/')
        }
    })
    .catch(err => console.log(err));
        
   
    // Product.deleteById(req.body.productId).then(result =>{
        
    //     console.log('result',result);
    //     res.redirect('/admin/products')
        
        
    // }).catch(err => console.log(err))

}