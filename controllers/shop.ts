import { NextFunction, Response,Request } from "express";
import { Cart } from "../models/cart";
import { OrderItem } from "../models/order-item";
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
    let fetchedCart:Cart;
    let newQuantity = 1;
    req.user!.getCart()
    .then(cart => {
        fetchedCart = cart!;
        return cart!.getProducts({where: {id:prodId}});
    })
    .then( products => {
        let product: Product | null = null;
        if(products.length > 0){
            product = products[0];
        }
        
        if(product){
            const oldQuantity = product.CartItem.quantity;
            newQuantity = oldQuantity + 1;
            // return fetchedCart.addProduct(product, {through: {quantity: newQuantity}})
            return product;
        }
        return Product.findByPk(prodId) 
    })
    .then(product => {
        return fetchedCart.addProduct(product!, {through: {quantity: newQuantity}})
    })
    .then(() => {  
        res.redirect('/cart')
    })
    .catch(err => {
        console.log(err);
        
    })
   
}


export const getCart = (req: Request, res: Response, next: NextFunction) => {
        req.user!.getCart()
        .then( (result) => {
            // console.log(result);
            return result!.getProducts()
            .then(products => {
                res.render('shop/cart', {
                    products: products,
                    pageTitle: 'Your Cart',
                    path:'/cart'
                })
            }).catch((err:Error) => {
                console.log(err);   
            })
            
        }

        ).catch((err:Error) => {
            console.log(err);   
        })

}
    

export const getOrders = (req: Request, res: Response, next: NextFunction) => {
    req.user!
    .getOrders({include : ['products']})
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders,
      });
    })
    .catch((err: Error) => {
      console.log(err);
    });

    // res.render('shop/orders', {
    //     pageTitle: 'Your Orders',
    //     path: '/orders'
    // });
}
export const getCheckout = (req: Request, res: Response, next: NextFunction) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}


export const postCartDeleteItem = (req: Request, res: Response, next: NextFunction) => {
   
    const prodId = req.body.id;
    req.user!
    .getCart()
    .then((cart) => {
      return cart!.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      if (product) {
        return product.CartItem.destroy();
      }
      throw new Error("Product not found in cart");
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err: Error) => {
      console.log(err);
    });
}

export const postOrder = (req: Request, res: Response, next: NextFunction) => {
    let fetchedCart: Cart;

  req.user!
    .getCart()
    .then((cart) => {
      fetchedCart = cart!;
      return cart!.getProducts();
    })
    .then((products) => {
      return req.user!
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
                product.OrderItem = { quantity: product.CartItem.quantity };
                // console.log(product.OrderItem, ' 111111 ', product);
            //   product.OrderItem.quantity = product.CartItem.quantity; 
              return product;
            
            })
          );
        })
        .catch((err: Error) => {
          console.log(err);
        });
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err: Error) => {
      console.log(err);
    });
}

