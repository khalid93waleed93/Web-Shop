import { NextFunction, Response,Request } from "express";
// import { Cart } from "../models/cart";
// import { OrderItem } from "../models/order-item";
import { Product } from "../models/product";

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
    Product.fetchAll().then( (result) => {
        res.render('shop/products', {
            prods: result,
            pageTitle: 'All Products',
            path:'/products'
        })
    }).catch(err => console.log(err));
   
}
export const getProduct = (req: Request, res: Response, next: NextFunction) => {
    const prodId= req.params.productId; 
    
     Product.findById(prodId.toString()).then((result) =>{
        if(result){
          console.log('controller',result);
          
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
    Product.fetchAll().then( (result) => {
        res.render('shop/index', {
            prods: result,
            pageTitle: 'Shop',
            path:'/'
        })
    }).catch(err => console.log(err));
}
export const postCart = (req: Request, res: Response, next: NextFunction) => {
    const prodId = req.body.productId;
    Product.findById(prodId.toString())
    .then(product => {
        if(product){
            const { title, price, description, imageUrl, _id } = product
            return req.user.addToCart(new Product(title,price,description,imageUrl,req.user._id,_id))
        }
        return
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart')
        
    })
    .catch(err => console.log(err))
   
}


export const getCart = (req: Request, res: Response, next: NextFunction) => {
        req.user!.getCart()
        .then( products => {
            
                res.render('shop/cart', {
                    products: products,
                    pageTitle: 'Your Cart',
                    path:'/cart'
                })
        }).catch((err:Error) => {
            console.log(err);   
        })

}
    

export const getOrders = (req: Request, res: Response, next: NextFunction) => {
    req.user!
    .getOrders()
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

}
export const getCheckout = (req: Request, res: Response, next: NextFunction) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}


export const postCartDeleteItem = (req: Request, res: Response, next: NextFunction) => {
   
    const prodId = req.body.id;
    req.user!.deleteItemFromCart(prodId)
    .then(()=> {
        res.redirect('/cart');
    })
    .catch((err: Error) => {
      console.log(err);
    });
}

export const postOrder = (req: Request, res: Response, next: NextFunction) => {
    
  req.user!
    .addOrder()
  //   .then((cart) => {
  //     fetchedCart = cart!;
  //     return cart!.getProducts();
  //   })
  //   .then((products) => {
  //     return req.user!
  //       .createOrder()
  //       .then((order) => {
  //         return order.addProducts(
  //           products.map((product) => {
  //               product.OrderItem = { quantity: product.CartItem.quantity };
  //               // console.log(product.OrderItem, ' 111111 ', product);
  //           //   product.OrderItem.quantity = product.CartItem.quantity; 
  //             return product;
            
  //           })
  //         );
  //       })
  //       .catch((err: Error) => {
  //         console.log(err);
  //       });
  //   })
  //   .then(() => {
  //     return fetchedCart.setProducts(null);
  //   })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err: Error) => {
      console.log(err);
    });
}

