import { NextFunction, Response,Request } from "express";

import { Product, ProductProps } from "../models/product";
import { Cart, CartProduct} from "../models/cart";

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
    Product.fetchAll(products => {
        res.render('shop/products', {
            prods: products,
            pageTitle: 'Products',
            path: '/products'
        });
    });
}
export const getProduct = (req: Request, res: Response, next: NextFunction) => {
    const prodId= req.params.productId; 
    Product.findById(prodId, product => {
        res.render('shop/product-detail',{
            product:product,
            pageTitle:product.title,
            path: '/products'
        })
   })
   
}



export const getIndex = (req: Request, res: Response, next: NextFunction) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
}
export const postCart = (req: Request, res: Response, next: NextFunction) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(product.id!,product.price);
    });
    res.redirect('/cart');
}


export const getCart = (req: Request, res: Response, next: NextFunction) => {
    Cart.getCart(cart => {
        const cartProducts: any[] = []
        Product.fetchAll( products => {
            cart.products.forEach(cartProduct => {
                products.forEach(product => {
                    if(product.id === cartProduct.id){
                        cartProducts.push({productData: product, qty: cartProduct.qty})
                    }
                })
                
            });
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: cartProducts
            })
        })
        
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
    Product.findById(req.body.id, p => {
        Cart.deleteProduct(req.body.id,p.price);
        res.redirect('/cart')
    })
    
    // Cart.deleteProduct(req.body.id,parseFloat(req.body.price))
}

