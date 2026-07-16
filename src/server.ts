import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { handleAdminCheck } from "./Controllers/adminCheckController.ts";

import {
  fetchCollections,
  fetchSingleCollection,
  addCollection,
  updateCollection,
  deleteCollection,
} from "./Controllers/collectionsController.ts";

import { connectCollectionsDB } from "./Config/DB.Collections.ts";
import { connectOrdersDB } from "./Config/DB.Orders.ts";

const app = express();
dotenv.config();

/*
 * The connect database functions must come immediately after
 * const app = express() and dotenv.config()
 * And Before the Middleware and the routes
 */
connectCollectionsDB();
connectOrdersDB();

// MiddleWare
app.use(cors());
app.use(express.json());

// Admin check route
app.post("/api/admin-check", handleAdminCheck);

// Collections Routes
app.get("/api/collections", fetchCollections);
app.get("/api/collections/:id", fetchSingleCollection);
app.post("/api/collections", addCollection);
app.put("/api/collections/:id", updateCollection);
app.delete("/api/collections/:id", deleteCollection);

/*
 * For development purposes, the server will listen on localhost 3001
 * But will listen on a render server when in production
 */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Eclipse Wearable server running on http://localhost:${PORT}`);
});
