import { NextFunction, Response,Request } from "express";

import { Product, ProductProps } from "../models/product";
export const getAddProduct = (req: Request, res: Response, next: NextFunction) => { 
    res.render('add-product',{ 
        pageTitle:'Add Product',
        path:'/admin/add-product'
    });
}

export const postAddProduct = (req: Request, res: Response, next: NextFunction) => {
    const inputVal = req.body.price;
        // Check if input value is not a positive number with two decimal places
    if ((req.body) && (isNaN(parseFloat(inputVal)) || parseFloat(inputVal) < 0 || inputVal.includes(".") && inputVal.split(".")[1].length > 2)) {
        // If the input value is not valid, send an error response
        return res.status(400).json({error: "Invalid price value"});
    }
  
    const productData: ProductProps = {
        title: req.body.title,
        description: req.body.description,
        price: parseFloat(req.body.price)
      };
      const product = new Product(productData);
      product.save();
      res.redirect('/');
    }
export const getShop = (req: Request, res: Response, next: NextFunction) => {
    Product.fetchAll(products => {
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
}