import { NextFunction, Response,Request } from "express";
// import { Product } from "../models/product";
import { Product } from "../models/product";

export const getAddProduct = (req: Request, res: Response, next: NextFunction) => { 
    res.render('admin/edit-product',{ 
        pageTitle:'Add Product',
        path:'/admin/add-product',
        editing: false
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
                editing:editMode
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
    const product = new Product(title, price, description, imageUrl,req.user._id, productId)
    product.save()
    // Product.findById(req.body.productId)
    // .then(result => {
        
    //     if(result){
    //     result.title = req.body.title;
    //     result.price = req.body.price;
    //     result.description = req.body.description;
    //     result.imageUrl = req.body.imageUrl
    //     return result?.save()
    //     }else{
    //         return
    //     }
    // })
    .then(result =>{
        
        console.log('updated product');
        res.redirect('/admin/products')
        
    }).catch(err => console.log(err))
    
}

export const postAddProduct = (req: Request, res: Response, next: NextFunction) => {
    const inputVal = req.body.price;
        // Check if input value is not a positive number with two decimal places
    if ((req.body) && (isNaN(parseFloat(inputVal)) || parseFloat(inputVal) < 0 || inputVal.includes(".") && inputVal.split(".")[1].length > 2)) {
        // If the input value is not valid, send an error response
        return res.status(400).json({error: "Invalid price value"});
    }
    // console.log('reeeq',req.user);
    const { title, price, description, imageUrl } = req.body;
    const product = new Product(title, price, description, imageUrl, req.user._id)
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
        res.render('admin/products', {
            prods: result,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    }).catch((err: Error) => console.log(err))
    
}
export const postDeleteProduct = (req: Request, res: Response, next: NextFunction) => {
    Product.deleteById(req.body.productId).then(result =>{
        
        console.log('destroyed product');
        res.redirect('/admin/products')
        
        
    }).catch(err => console.log(err))

}