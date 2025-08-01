"use strict";
/* this is the main file that runs your server! */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // loads the express module into the project so you can build your server
const app = (0, express_1.default)(); // creates an instance of an Express app
const routes_1 = __importDefault(require("./routes")); // imports your routes from the src/routes/index.js file so Express knows what to do when users visit URLs
app.use(express_1.default.json()); // Built-in Express middleware that lets you read JSON data from incoming requests (e.g. POST requests with JSON bodies).
app.use("/", routes_1.default); // this tells Express when a user visits any route starting with '/', use the logic from the routes file
const PORT = process.env.PORT || 3000; // sets a port number - use special port number from env file var; if not, defaults to 3000
// Starts the server and listens for requests. Once it’s running, it prints a message to the terminal.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
