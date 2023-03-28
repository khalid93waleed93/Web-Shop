import { NextFunction, Response,Request } from "express";
import { Product } from "../models/product";
// import { Product } from "../models/product";

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
    // Product.findByPk(prodId)
    req.user!.getProducts({where: {id: prodId}})
    .then((results: Product[]) =>{
        if(results){
            const result = results[0];
            
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
    // Product.findById(prodId, product =>{
    //     res.render('admin/edit-product',{ 
    //         pageTitle:'Edit Product',
    //         path:'/admin/edit-product',
    //         editing: editMode,
    //         product: product
    //     });
    // })
    
}
export const postEditProduct = (req: Request, res: Response, next: NextFunction) => {
    const inputVal = req.body.price;
        // Check if input value is not a positive number with two decimal places
    if ((req.body) && (isNaN(parseFloat(inputVal)) || parseFloat(inputVal) < 0 || inputVal.includes(".") && inputVal.split(".")[1].length > 2)) {
        // If the input value is not valid, send an error response
        return res.status(400).json({error: "Invalid price value"});
    }
    Product.findByPk(req.body.productId).then(result => {
        if(result){
        result.title = req.body.title;
        result.price = req.body.price;
        result.description = req.body.description;
        result.imageUrl = req.body.imageUrl
        return result?.save()
        }else{
            return
        }
    }).then(result =>{
        if(result){
        console.log('updated product');
        res.redirect('/admin/products')
        } else {
            return
        }
    }).catch(err => console.log(err))
        
    // const productData: ProductProps = {
    //     id: req.body.productId,
    //     title: req.body.title,
    //     description: req.body.description,
    //     imageUrl: req.body.imageUrl,
    //     price: parseFloat(req.body.price)
    // };
    // const updatedProduct = new Product(productData);
    // updatedProduct.save();
    // res.redirect('/admin/products')
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
    // const productData: ProductAttributesWithUserId = {
    //   title,
    //   price,
    //   description,
    //   imageUrl,
    //   UserId: req.user!.id  // Hier fügen wir das userId-Feld hinzu
    // };
    // Product.create(productData))
    
    req.user!.createProduct(
        {
        title,
        price,
        description,
        imageUrl,
        }).then(() => {
            console.log('added product');
            res.redirect('/admin/products')
            
        }).catch((err: Error) => {
            console.log( err.message , err.name, err.stack)
        })
}
export const getProducts = (req: Request, res: Response, next: NextFunction) => {
    // Product.findAll()
    req.user!.getProducts()
    .then((result: Product[]) => {
        res.render('admin/products', {
            prods: result,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    }).catch((err: Error) => console.log(err))
    //     res.render('admin/products', {
    //         prods: products,
    //         pageTitle: 'Admin Products',
    //         path: '/admin/products'
    //     });
    // });
}
export const postDeleteProduct = (req: Request, res: Response, next: NextFunction) => {
    Product.findByPk(req.body.productId).then(result => {
        if(result){
        return result.destroy()
        }else{
            return
        }
    }).then(result =>{
        
        console.log('destroyed product');
        res.redirect('/admin/products')
        
        
    }).catch(err => console.log(err))

}