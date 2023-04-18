import { NextFunction, Response,Request } from "express";
import { Product, IProduct} from "../models/product";
import { Order } from "../models/order";
import { writeInvoicePdf } from "../util/fileHelper";

const ITEM_PER_PAGE = 1;

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Product.fetchAll();
        res.render('shop/products', {
            prods: result,
            pageTitle: 'All Products',
            path: '/products',
            isAuthenticated: req.session.isLoggedIn
        });
    } catch (err) {
        next(err);
    }
    
}
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const prodId = req.params.productId;
  
    try {
      const result = await Product.findById(prodId.toString());
  
      if (result) {
        res.render('shop/product-detail', {
          product: result,
          pageTitle: result.title,
          path: '/products',
          isAuthenticated: req.session.isLoggedIn,
        });
      } else {
        res.redirect('/404')
      }
    } catch (error) {
      next(error);
    }
  };


export const getIndex = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Product.fetchAll();
        res.render('shop/index', {
            prods: result,
            pageTitle: 'Shop',
            path: '/',
            isAuthenticated: req.session.isLoggedIn
        });
    } catch (err) {
        next(err)    
   }
}
export const postCart = async (req: Request, res: Response, next: NextFunction) => {
    
    const prodId = req.body.productId;
    try {
        const product = await Product.findById(prodId.toString());
        if (product) {
            // const { title, price, description, imageUrl, _id } = product
            const result = await req.user!.addToCart(product);
            console.log(result?._id);
            res.redirect('/cart');
        }
    } catch (err) {
        next(err);
    }
   
}

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userWithCart = await req.user!.populate('cart.items.productId');
        res.render('shop/cart', {
            products: userWithCart.cart.items,
            pageTitle: 'Your Cart',
            path: '/cart',
            isAuthenticated: req.session.isLoggedIn
        });
    } catch (err) {
        next(err);
    }
};
    

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.findByUserId(req.user!._id);
        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders: orders,
            isAuthenticated: req.session.isLoggedIn
        });
    } catch (err) {
        next(err);
    }

}
// export const getCheckout = (req: Request, res: Response, next: NextFunction) => {
// //     res.render('shop/checkout', {
// //         pageTitle: 'Checkout',
// //         path: '/checkout'
// //     });
// }


export const postCartDeleteItem = async (req: Request, res: Response, next: NextFunction) => {
    const prodId = req.body.id;
    try {
        await req.user!.deleteItemFromCart(prodId);
        res.redirect('/cart');
    } catch (err) {
        next(err);
    }
}

export const postOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await req.user.populate('cart.items.productId');
        const products = user.cart.items.map(i => {
            return {quantity: i.quantity, product: { ...i.productId }}
        });
        const order = new Order(
            {
            email: req.user!.email,
            userId: req.user!._id
            },
            products
        );
        order.save();
        await user.clearCart();
        res.redirect('/orders');
    } catch (err) {
        next(err);
    }
}

export const getInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.orderId;
        const invoiceName = 'invoice-' + orderId + '.pdf';
        // const invoicePath = path.join(rootDir, 'data', 'invoices', invoiceName);
        const order = await Order.findById(orderId);

        if (!order) {
            return next(new Error('No order'));
        }
        if (order.user.userId.toString() !== req.user.id) {
            return next(new Error('Unauthorized'));
        }
        writeInvoicePdf(order,res,invoiceName);
        
    } catch (err) {
        console.log(err);
        
        // next(err);
    }
};


// export const getInvoice = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const orderId = req.params.orderId;
//         const invoiceName = 'invoice-'+ orderId + '.pdf'
//         const invoicePath = path.join(rootDir,'data','invoices',invoiceName);
//         const order = await Order.findById(orderId);
//         if(!order){
//             return next(new Error('No order'))
//         }
//         if(order.user.userId.toString() !== req.user.id){
//             return next(new Error(' Unauthorized'))
//         }
//         const pdfDoc = new PDFDocument();
//         res.setHeader('Content-Type','application/pdf');
//         res.setHeader('Content-Disposition','inline; filename="' + invoiceName + '"' );
//         pdfDoc.pipe(createWriteStream(invoicePath));
//         pdfDoc.pipe(res);
//         pdfDoc.fontSize(26).text('Invoice', {underline:true});
//         pdfDoc.text('----------');
//         let totalPrice = 0;
//         order.products.forEach(p => {
//             totalPrice += p.quantity * p.product.price
//             pdfDoc.fontSize(14).text(p.product.title + ' - '+ p.quantity + ' x $' + p.product.price)
//         });
//         pdfDoc.text('-----');
//         pdfDoc.text('Total Price: $' + totalPrice.toFixed(2))
//         pdfDoc.end()
//         // readFile(invoicePath,(err,data) => {
//         //     if(err){
//         //         return next(err)
//         //     }
//         //     res.setHeader('Content-Type','application/pdf')
//         //     res.setHeader('Content-Disposition','inline; filename="d' + invoiceName + '"' )
//         //     res.send(data)
//         // })
//     //    const file = createReadStream(invoicePath);
//     //    res.setHeader('Content-Type','application/pdf')
//     //    res.setHeader('Content-Disposition','inline; filename="' + invoiceName + '"' )
//     //    file.pipe(res)
        
//     } catch (err) {
//         next(err);
//     }
// }