import { NextFunction, Response,Request } from "express";
// import { Cart } from "../models/cart";
// import { OrderItem } from "../models/order-item";
import { Product, IProduct} from "../models/product";
import { User } from "../models/user";
import { Order } from "../models/order";

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
    Product.fetchAll()
    // .select('title price -_id')
    // .populate('userId', 'email name -_id')
    .then( (result) => {
        console.log(result);
        
        res.render('shop/products', {
            prods: result,
            pageTitle: 'All Products',
            path:'/products',
            isAuthenticated: req.session.isLoggedIn
        })
    }).catch(err => console.log(err));
   
}
export const getProduct = (req: Request, res: Response, next: NextFunction) => {
    const prodId= req.params.productId; 
    
     Product.findById(prodId.toString()).then((result) =>{
        if(result){
        //   console.log('controller',result);
          
            res.render('shop/product-detail',{
                product: result,
                pageTitle: result.title,
                path:'/products',
                isAuthenticated: req.session.isLoggedIn
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
            path:'/',
            isAuthenticated: req.session.isLoggedIn
        })
    }).catch(err => console.log(err));
}
export const postCart = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body.x_csrf_token);
    
    const prodId = req.body.productId;
    Product.findById(prodId.toString())
    .then(product => {
        if(product){
            // const { title, price, description, imageUrl, _id } = product
            return req.user!.addToCart(product)
            
        }
        return
    })
    .then(result => {
        
        console.log(result?._id);
        res.redirect('/cart')
        
    })
    .catch(err => console.log(err))
   
}


export const getCart = (req: Request, res: Response, next: NextFunction) => {
        // User
        // .findById(req.user._id)
        // .select('cart')
        req.user!
        .populate('cart.items.productId')
        
        .then( c => {

            console.log(c?.cart.items);
            
                res.render('shop/cart', {
                    products: c?.cart.items,
                    pageTitle: 'Your Cart',
                    path:'/cart',
                    isAuthenticated: req.session.isLoggedIn
                })
        }).catch((err:Error) => {
            console.log(err);   
        })

}
    

export const getOrders = (req: Request, res: Response, next: NextFunction) => {
    Order.findByUserId(req.user!._id)
    .then((orders) => {
        console.log('getOrders',orders);
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err: Error) => {
      console.log(err);
    });

}
export const getCheckout = (req: Request, res: Response, next: NextFunction) => {
//     res.render('shop/checkout', {
//         pageTitle: 'Checkout',
//         path: '/checkout'
//     });
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
    .populate('cart.items.productId')
    .then((user) => {
        // console.log(user.cart.items);
        
        const products = user.cart.items.map(i => {
            return {quantity: i.quantity, product: { ...i.productId }}
        })
        const order = new Order(
             {
                email: req.user!.email,
                userId: req.user!._id
            }, products
        )
       return order.save()
      
    }).then(result => {
        return req.user!.clearCart()
    }).then(result => {
        res.redirect('/orders');
    })
    .catch((err: Error) => {
      console.log(err);
    });
}

