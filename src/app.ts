/* this is the main file that runs your server! */

import dotenv from 'dotenv'; // dotenv: Loads environment variables from a .env file into process.env
dotenv.config(); // loads the environment variables into process.env.

import express from 'express'; // loads the express module into the project so you can build your server
import cors from 'cors'; // cors: Middleware that allows your server to accept requests from different origins (e.g. React FE app which runs on port 3000, while this BE server runs on port 8080)
import cookieParser from 'cookie-parser'; // cookie-parser: Middleware that helps you read cookies from incoming requests

import routes from './routes'; // imports your routes from the src/routes/index.js file so Express knows what to do when users visit URLs
import usersRoutes from './routes/users';
import ordersRoutes from './routes/orders';
import productsRoutes from './routes/products';
import orderItemsRoutes from './routes/orderItems';
import stripeRoutes from './routes/stripe';

const app = express(); // creates Fan instance of an Express app
app.use(express.static('public')); // for Stripe

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // allows requests from the FE React app running on port 5173
    credentials: true, // allows credentials (cookies) to be sent along with requests
  })
); // enables CORS so your server can accept requests from different origins (e.g. React FE app which runs on port 5173, while this BE server runs on port 8080)
app.use(express.json()); // Built-in Express middleware that lets you read JSON data from incoming requests (e.g. POST requests with JSON bodies).
app.use(cookieParser()); // enables cookie parsing so you can read cookies from incoming requests

// DEFINING ROUTES
app.use('/api', routes); // this tells Express when a user visits any route starting with '/', use the logic from the routes file
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orderItems', orderItemsRoutes);
app.use('/api/stripe', stripeRoutes);

const PORT = process.env.PORT || 8080; // sets a port number - use special port number from env file var; if not, defaults to 5173

// Starts the server and listens for requests. Once it’s running, it prints a message to the terminal.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
