import { NextFunction, Response,Request } from "express";
import { Product, ProductProps } from "../models/product";

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
    Product.findById(prodId, product =>{
        res.render('admin/edit-product',{ 
            pageTitle:'Edit Product',
            path:'/admin/edit-product',
            editing: editMode,
            product: product
        });
    })
    
}
export const postEditProduct = (req: Request, res: Response, next: NextFunction) => {
    const inputVal = req.body.price;
        // Check if input value is not a positive number with two decimal places
    if ((req.body) && (isNaN(parseFloat(inputVal)) || parseFloat(inputVal) < 0 || inputVal.includes(".") && inputVal.split(".")[1].length > 2)) {
        // If the input value is not valid, send an error response
        return res.status(400).json({error: "Invalid price value"});
    }
    const productData: ProductProps = {
        id: req.body.productId,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: parseFloat(req.body.price)
    };
    const updatedProduct = new Product(productData);
    updatedProduct.save();
    res.redirect('/admin/products')
}

export const postAddProduct = (req: Request, res: Response, next: NextFunction) => {
    const inputVal = req.body.price;
        // Check if input value is not a positive number with two decimal places
    if ((req.body) && (isNaN(parseFloat(inputVal)) || parseFloat(inputVal) < 0 || inputVal.includes(".") && inputVal.split(".")[1].length > 2)) {
        // If the input value is not valid, send an error response
        return res.status(400).json({error: "Invalid price value"});
    }
  
    const productData: ProductProps = {
        id: null,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: parseFloat(req.body.price)
    };
    const product = new Product(productData);
    product.save();
    res.redirect('/');
}
export const getProducts = (req: Request, res: Response, next: NextFunction) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
}
export const postDeleteProduct = (req: Request, res: Response, next: NextFunction) => {
    Product.deleteById(req.body.id);
    res.redirect('/admin/products')

}