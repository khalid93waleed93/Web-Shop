import fs from 'fs/promises';
import path from 'path';
import { rootDir } from '../util/path';

export interface CartProduct {
  id: string;
  qty: number;
}

interface CartData {
  products: CartProduct[];
  totalPrice: number;
}

const cartFilePath = path.join(rootDir, 'data', 'cart.json');

export class Cart {
  static async addProduct(id: string, productPrice: number): Promise<void> {
    try {
      // Fetch the previous cart
      const cartData = await Cart.getCartData();

      // Analyze the cart => Find existing product
      const existingProductIndex = cartData.products.findIndex(prod => prod.id === id);
      const existingProduct = cartData.products[existingProductIndex];

      // Add new product/ increase quantity
      if (existingProduct) {
        existingProduct.qty++;
      } else {
        cartData.products.push({ id, qty: 1 });
      }

      cartData.totalPrice += productPrice;

      await Cart.saveCartData(cartData);
    } catch (error) {
      console.error('Failed to add product to cart', error);
      throw error;
    }
  }
  static async deleteProduct (id:string, price:number){
    const cartProducts = await Cart.getCartData();
    const updatedCartProducts = {...cartProducts};
    const product = updatedCartProducts.products.find(e => e.id === id);
    if(!product){
      return
    }
    const productQty = product.qty;
    updatedCartProducts.products = updatedCartProducts.products.filter(e => e.id !== id);
    updatedCartProducts.totalPrice = updatedCartProducts.totalPrice - price * productQty;
    await this.saveCartData(updatedCartProducts);
  }

  static async getCart(callback: (arg0: CartData) => void) {
   const cart = await Cart.getCartData();
   callback(cart)
  }
  private static async getCartData(): Promise<CartData> {
    try {
      const fileContent = await fs.readFile(cartFilePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Failed to read cart data', error);
      return { products: [], totalPrice: 0 };
    }
  }

  private static async saveCartData(cartData: CartData): Promise<void> {
    try {
      await fs.writeFile(cartFilePath, JSON.stringify(cartData));
    } catch (error) {
      console.error('Failed to save cart data', error);
      throw error;
    }
  }
}
