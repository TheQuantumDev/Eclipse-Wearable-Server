import { type Request, type Response } from "express";
import { v7 as uuidv7 } from "uuid";
import Collections from "../Models/Model.Collections.ts";

// Get all collections
export async function fetchCollections(req: Request, res: Response) {
  try {
    const collections = await Collections.find().sort({ createdAt: -1 });
    res.status(200).json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}

// Get a single collection by UUID
export async function fetchSingleCollection(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const collection = await Collections.findOne({ uuid: id });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json(collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}

// Add a new collection
export async function addCollection(req: Request, res: Response) {
  try {
    const { name, price, category, images, sizes, description } = req.body;

    // Validate required fields
    if (!name || !price || !category || !images || images.length === 0) {
      return res.status(400).json({
        message:
          "Missing required fields: name, price, category, and at least one image are required",
      });
    }

    const newCollection = new Collections({
      uuid: uuidv7(), // Generate UUID v7
      name,
      price,
      category,
      images,
      sizes: sizes || ["M", "L"],
      description: description || "",
      inStock: true,
    });

    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (error) {
    console.error("Error adding collection:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}

// Update a collection by UUID
export async function updateCollection(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCollection = await Collections.findOneAndUpdate(
      { uuid: id },
      { ...updateData },
      { new: true, runValidators: true },
    );

    if (!updatedCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json(updatedCollection);
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}

// Delete a collection by UUID
export async function deleteCollection(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const deletedCollection = await Collections.findOneAndDelete({ uuid: id });

    if (!deletedCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}