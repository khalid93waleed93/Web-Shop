import fs, { createWriteStream } from 'fs'
import { IOrder } from '../models/order'
import { Response } from 'express'
import PDFDocument from 'pdfkit'
import path from 'path'
import { rootDir } from './path'
export const deleteFile = (filePath:string) => {
    fs.unlink(filePath, err => {
        if(err)
        throw (err)
    })
}
export const writeInvoicePdf = (order:IOrder, res: Response, invoiceName: string) => {
    const invoicePath = path.join(rootDir, 'data', 'invoices', invoiceName);
    const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
        pdfDoc.pipe(createWriteStream(invoicePath));
        pdfDoc.pipe(res);

        // Add invoice header
        pdfDoc.fontSize(26).text('Invoice', { underline: true });
        pdfDoc.moveDown();

        // Add order details
        pdfDoc.fontSize(14).font('Helvetica-Bold').text('Order ID:', { continued: true });
        pdfDoc.font('Helvetica').text(order.id);
        pdfDoc.font('Helvetica-Bold').text('Email:', { continued: true });
        pdfDoc.font('Helvetica').text(order.user.email);
        pdfDoc.moveDown();

        // Add products table header
        pdfDoc.font('Helvetica-Bold').text('Product', { width: 200, align: 'left', continued: true });
        pdfDoc.text('Quantity', { width: 100, align: 'left', continued: true });
        pdfDoc.text('Price', { width: 100, align: 'right' });
        pdfDoc.moveDown(0.5);

        // Add products table content
        let totalPrice = 0;
        order.products.forEach(p => {
            totalPrice += p.quantity * p.product.price;
            pdfDoc.font('Helvetica').text(p.product.title, { width: 200, align: 'left', continued: true });
            pdfDoc.text(p.quantity.toString(), { width: 100, align: 'left', continued: true });
            pdfDoc.text('$' + p.product.price, { width: 100, align: 'right' });
            pdfDoc.moveDown();
        });

        // Add total price
        pdfDoc.moveDown();
        pdfDoc.font('Helvetica-Bold').text('Total Price:', { continued: true });
        pdfDoc.font('Helvetica').text('$' + totalPrice.toFixed(2));

        // Finalize PDF
        pdfDoc.end();
}