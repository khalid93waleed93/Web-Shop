import { NextFunction, Response,Request } from "express";
import { Cart } from "../models/cart";
import { Product } from "../models/product";

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
    Product.findAll().then( (result) => {
        res.render('shop/products', {
            prods: result,
            pageTitle: 'All Products',
            path:'/products'
        })
    }).catch(err => console.log(err));
   
}
export const getProduct = (req: Request, res: Response, next: NextFunction) => {
    const prodId= req.params.productId; 
    
     Product.findByPk(prodId).then((result) =>{
        if(result){
            res.render('shop/product-detail',{
                product: result,
                pageTitle: result.title,
                path:'/products'
                })
        } else {
            res.status(404).render('404',{pageTitle:'Page not found', path:req.url})
        }
    }).catch(err => console.log(err));
   
}



export const getIndex = (req: Request, res: Response, next: NextFunction) => {
    Product.findAll().then( (result) => {
        res.render('shop/index', {
            prods: result,
            pageTitle: 'Shop',
            path:'/'
        })
    }).catch(err => console.log(err));
}
export const postCart = (req: Request, res: Response, next: NextFunction) => {
    const prodId = req.body.productId;
   
}


export const getCart = (req: Request, res: Response, next: NextFunction) => {
        req.user.getCart()
        .then( (result: Cart) => {
            console.log(result);
            return result.getProducts()
            
        }

        ).catch((err:Error) => {
            console.log(err);   
        })

}
    

export const getOrders = (req: Request, res: Response, next: NextFunction) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders'
    });
}
export const getCheckout = (req: Request, res: Response, next: NextFunction) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}


export const postCartDeleteItem = (req: Request, res: Response, next: NextFunction) => {
   
    
    // Cart.deleteProduct(req.body.id,parseFloat(req.body.price))
}

