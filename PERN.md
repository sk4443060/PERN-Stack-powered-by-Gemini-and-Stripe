                           PERN GUIDE
                               |
     -------------------------------------------------------
     |                                                     |
  Backend                                              Frontend

###############################################################
FOLLOW STEPS
---------------------------------------------------------------

[STEP: 01] Installation:
     Initialize your node application and install all the necessery dependencies inside
     "root/server/"

     npm install bcrypt cloudinary cookie-parser cors dotenv express express-fileupload jsonwebtoken nodemailer pg stripe

  NOTE: Don't forgot to initialize the server folder

    npm init -y

  NOTE: Update the type to module in package.json

  NOTE: Also add the script inside script object as:

      "start": "node server.js",
      "dev": "nodemon server.js",
  
  ------------------------------------------------
  | Understand the purpose of these dependencies |
  ------------------------------------------------
  bcrypt             : User password encrypts
  cloudinary         : Stores images
  cookie-parser      : Use to get the stored cookies
  cors               : Connects the frontend and backend
  dotenv             : Store secrate variables
  express            : Backend server
  express-fileupload : Send the file from frontend during upload like saving the Avatar image
  jsonwebtoken       : Generates JWT Token
  nodemailer         : Helps to send emails
  pg                 : Postgres Database to store data
  stripe             : Processing the payments

[STEP: 02] Environment Variable Setup
You need to create a folder config. Then create a new file config.env in it.
config/config.env

    PORT = 4000
    FRONTEND_URL = http://localhost:5173         -> Do not use forward slash at the end
    DASHBOARD_URL = http://localhost:5174        -> Same " " " "  "
    JWT_EXPIRES_IN = 7d
    COOKIE_EXPIRES_IN = 30
    JWT_SECRET_KEY = jwthkdhdhadad73u3uj   -> Random value as per your choice
    
    SMTP_SERVICE = gmail
    SMTP_MAIL = sk4443060@gmail.com
    SMTP_PASSWORD = xxXXXXXXXXXXXX
    SMTP_HOST = smtp.gmail.com
    SMTP_PORT = 465
    
    GEMINI_API_KEY = XXXXXXXXXXXXXXXXXXXXXXX
    
    CLOUDINARY_CLIENT_NAME = didzzcz00
    CLOUDINARY_CLIENT_API = XXXXXXXXXXXXXXXXX
    CLOUDINARY_CLIENT_SECRET = xXXXXXXXXXXXXXXXXXXX
    
    STRIPE_SECRET_KEY = XXXXXXXXXXXXXX
    STRIPE_WEBHOOK_SECRET = XXXXXXXXXXXXXXXXXXXX
    STRIPE_FRONTEND_KEY = XXXXXXXXXXXXXXXXXXXXXXXX

[STEP: 03] After env setup proceed to Create & Setup app.js and server.js Files in root directory of the backend

    touch app.js server.js
    
  - Setup dotenv, cors, cookie-parser, express, fileupload and export your express from app.js file.
  - Import express from app.js file and then import cloudinary and listen to your server in your server.js file.
  - server/app.js

        import express from "express";
        import { config } from "dotenv";
        import cors from "cors";
        import cookieParser from "cookie-parser";
        import fileUpload from "express-fileupload";
        
        const app = express();
        
        config({ path: "./config/config.env" });
        
        app.use(cors({
            origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }));
        
        app.use(cookieParser());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        
        app.use(fileUpload({
            tempFileDir: "./upload",
            useTempFiles: true
        }));
        
        export default app;

    - server/server.js
   
          import app from "./app.js";
          import { v2 as cloudinary } from "cloudinary"
          
          cloudinary.config({
              cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
              api_key: process.env.CLOUDINARY_CLIENT_API,
              api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
          });
          
          app.listen(process.env.PORT, () => {
              console.log(`Server is running on port ${process.env.PORT}`);
          });

[STEP: 04] Setup your Postgree or your preferred Database Like MySQL DB, But I prefer PostgreeSQL DB.
  - Create a folder database in server root. Then
  - Create a file in this folder db.js and
  - Setup your database.
  - Write code like this and Establish the connection with database

        import pkg from "pg";
        const { Client } = pkg;
        
        // CREATE DATABASE
        const database = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });
        
        // ESTABLISHING CONNECTION WITH DATABASE
        try {
            await database.connect();
            console.log("Database connected successfully");
        } catch (error) {
            console.error("Database connection failed:", error);
            process.exit(1);
        }

  - Call your database in your app.js file.
    
[STEP: 05] You Need To Create User Table, Follow These Simple Steps
  - server/models/userTable.js    
  - Create users table from scratch with clear explanation because we will copy paste other tables.

        import database from "../database/db.js";
  
        export async function createUserTable() {
            try {
                const query = `
                    CREATE TABLE IF NOT EXISTS users (
                        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                        name VARCHAR(255) NOT NULL CHECK (char_length(name) >= 3),
                        email VARCHAR(255) UNIQUE NOT NULL,
                        password TEXT NOT NULL,
                        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('User', 'Admin')),
                        avtar JSONB DEFAULT NULL,
                        reset_password_token TEXT DEFAULT NULL,
                        reset_password_expire TIMESTAMP DEFAULT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                `;
                await database.query(query);
                console.log("User table created successfully");
            } catch (error) {
                console.error("Error creating user table:", error);
                process.exit(1);
            }

  - Follow the 06th steps to make the other tables 

[STEP: 06] 6th Step (Copy-Paste All Other Tables)
  - Copy-paste products Table in a new file productsTable.js file:

        import database from "../database/db.js"; export async function createProductsTable() {   try {     const query = `     CREATE TABLE IF NOT EXISTS products (     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,     name VARCHAR(255) NOT NULL,     description TEXT NOT NULL,     price DECIMAL(10,2) NOT NULL CHECK (price >= 0),     category VARCHAR(100) NOT NULL,     ratings DECIMAL(3,2) DEFAULT 0 CHECK (ratings BETWEEN 0 AND 5),     images JSONB DEFAULT '[]'::JSONB,     stock INT NOT NULL CHECK (stock >= 0),     created_by UUID NOT NULL,     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE);`;     await database.query(query);   } catch (error) {     console.error("❌ Failed To Create Products Table.", error);     process.exit(1);   } }

  - Copy-paste shipping_info Table in a new file shippinginfoTable.js file:

        import database from "../database/db.js"; export async function createShippingInfoTable() {   try {     const query = `     CREATE TABLE IF NOT EXISTS shipping_info (     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,     order_id UUID NOT NULL UNIQUE,     full_name VARCHAR(100) NOT NULL,     state VARCHAR(100) NOT NULL,     city VARCHAR(100) NOT NULL,     country VARCHAR(100) NOT NULL,     address TEXT NOT NULL,     pincode VARCHAR(10) NOT NULL,     phone VARCHAR(20) NOT NULL,     FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE);`;     await database.query(query);   } catch (error) {     console.error("❌ Failed To Create Shipping Info Table.", error);     process.exit(1);   } }

  - Copy-paste reviews Table in a new file productReviewsTable.js file:

        import database from "../database/db.js"; export async function createProductReviewsTable() {   try {     const query = `     CREATE TABLE IF NOT EXISTS reviews (       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,       product_id UUID NOT NULL,       user_id UUID NOT NULL,       rating DECIMAL(3,2) NOT NULL CHECK (rating BETWEEN 0 AND 5),       comment TEXT NOT NULL,       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE       );`;     await database.query(query);   } catch (error) {     console.error("❌ Failed To Create Products Reviews Table.", error);     process.exit(1);   } }

  - Copy-paste payments Table in a new file paymentsTable.js file:

        import database from "../database/db.js"; export async function createPaymentsTable() {    try {     const query = `       CREATE TABLE IF NOT EXISTS payments (         id UUID DEFAULT gen_random_uuid() PRIMARY KEY,         order_id UUID NOT NULL UNIQUE,         payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('Online')),         payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('Paid', 'Pending', 'Failed')),         payment_intent_id VARCHAR(255) UNIQUE,         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE       );`;     await database.query(query);   } catch (error) {     console.error("❌ Failed To Create Payments Table.", error);     process.exit(1);   } }

  - Copy-paste orders Table in a new file ordersTable.js file:

        import database from "../database/db.js"; export async function createOrdersTable() {   try {     const query = `     CREATE TABLE IF NOT EXISTS orders (     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,     buyer_id UUID NOT NULL,     total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),     tax_price DECIMAL(10,2) NOT NULL CHECK (tax_price >= 0),     shipping_price DECIMAL(10,2) NOT NULL CHECK (shipping_price >= 0),     order_status VARCHAR(50) DEFAULT 'Processing' CHECK (order_status IN ('Processing', 'Shipped', 'Delivered', 'Cancelled')),     paid_at TIMESTAMP CHECK (paid_at IS NULL OR paid_at <= CURRENT_TIMESTAMP),     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE         );`;     await database.query(query);   } catch (error) {     console.error("❌ Failed To Create Orders Table.", error);     process.exit(1);   } }

  - Copy-paste order_items Table in a new file orderItemsTable.js file:

        import database from "../database/db.js"; export async function createOrderItemTable() {   try {     const query = `     CREATE TABLE IF NOT EXISTS order_items (         id UUID DEFAULT gen_random_uuid() PRIMARY KEY,         order_id UUID NOT NULL,         product_id UUID NOT NULL,         quantity INT NOT NULL CHECK (quantity > 0),         price DECIMAL(10,2) NOT NULL CHECK (price >= 0),         image TEXT NOT NULL,         title TEXT NOT NULL,         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,         FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE         );`;     await database.query(query);   } catch (error) {     console.error("❌ Failed To Create Ordered Items Table.", error);     process.exit(1);   } }
