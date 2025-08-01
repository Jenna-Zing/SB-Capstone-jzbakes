"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router(); // Sets up a router using Express. Think of a router like a traffic controller — it decides where to send incoming requests.
const mainController_1 = require("../controllers/mainController");
router.get("/", mainController_1.getHome); // When someone visits the root route (/), this tells Express to call the getHome function to handle the request.
exports.default = router; // Makes this router available to be used in app.js.
