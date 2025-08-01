import express from "express";
const router = express.Router(); // Sets up a router using Express. Think of a router like a traffic controller — it decides where to send incoming requests.
import { getHome } from "../controllers/mainController";

router.get("/", getHome); // When someone visits the root route (/), this tells Express to call the getHome function to handle the request.

export default router; // Makes this router available to be used in app.js.
