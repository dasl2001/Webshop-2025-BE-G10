import express from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router()

//Skapa ny kategori (endast admin)
//Tar emot kategoridata från request body, sparar den i databasen och returnerar den skapade kategorin.
//Vid fel returneras ett passande felmeddelande.
router.post("/", adminAuth, async (req, res) => {
  try {
    const newCategory = new Category(req.body)
    await newCategory.save()
    res.status(201).json({ success: true, data: newCategory })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

//Uppdatera kategori (endast admin)
// PUT /:id – Uppdaterar en kategori (endast admin)
// - Kräver adminAuth-middleware
// - Body: fält att uppdatera (utan _id)
// - Svar: 200 med uppdaterad kategori, 404 om inte hittad, 500 vid fel
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = { ...req.body }
    delete categoryData._id

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: categoryData },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Kategori hittades inte" });
    }

    res.status(200).json({ data: updatedCategory })
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: error.message });
  }
})

//Radera kategori (endast admin)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params

    const deletedCategory = await Category.findByIdAndDelete(id)

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Fel vid radering av kategori:", error);
    res.status(500).json({ error: error.message });
  }
})

// Hämta alla kategorier (öppen för alla)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Hämta en specifik kategori (öppen för alla)
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ error: "Kategorin hittades inte" })
    }
    res.json(category)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router;









