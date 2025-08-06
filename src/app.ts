/* this is the main file that runs your server! */

import express from 'express'; // loads the express module into the project so you can build your server
const app = express(); // creates an instance of an Express app
import routes from "./routes";  // imports your routes from the src/routes/index.js file so Express knows what to do when users visit URLs
import usersRoutes from "./routes/users";
import ordersRoutes from "./routes/orders";
import productsRoutes from "./routes/products";
import orderItemsRoutes from "./routes/orderItems";

app.use(express.json()); // Built-in Express middleware that lets you read JSON data from incoming requests (e.g. POST requests with JSON bodies).

// DEFINING ROUTES
app.use("/", routes); // this tells Express when a user visits any route starting with '/', use the logic from the routes file
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orderItems', orderItemsRoutes);

const PORT = process.env.PORT || 3000; // sets a port number - use special port number from env file var; if not, defaults to 3000

// Starts the server and listens for requests. Once it’s running, it prints a message to the terminal.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
