# Web Shop Project

This project is a basic web shop application built with Node.js, Express, and TypeScript. It includes functionality for user authentication, product management, and order processing.

## Main Technologies

- **Node.js**: Backend runtime environment.
- **Express**: Web framework for Node.js.
- **TypeScript**: Superset of JavaScript with static typing.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Stripe**: Payment processing platform.
- **EJS**: Template engine for generating HTML markup.

## Main Features

1. **User Authentication**
   - Login, Signup, and Password Reset
   - Sessions and CSRF Protection

2. **Product Management**
   - Add, Edit, and Delete Products
   - Image Upload and Storage

3. **Order Management**
   - Add to Cart, View Cart
   - Checkout and Order Processing
   - Invoice Generation

4. **Payment Integration**
   - Stripe Payment Gateway for processing payments

## How to Use

### Installation

1. Clone the repository:

  git clone https://github.com/khalid93waleed93/Web-Shop.git
  cd Web-Shop

2. Install dependencies:

	npm install

3. Set up environment variables:

Create a .env file in the root directory and add the following:

	NODE_ENV
	STRIPE_SECRET_KEY
	MONGODB_PROD_URL
	MONGODB_DEV_URL
	BASE_PROD_URL // your live domain name
	BASE_DEV_URL //localhost:3000

#### Running the Application

Start the server:

	npm start

Open your browser and navigate to http://localhost:3000.