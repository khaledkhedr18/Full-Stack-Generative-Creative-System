import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const products = [
  // ──────────────────────────────────────────────
  // 1. Half Sleeve T-Shirt
  // ──────────────────────────────────────────────
  {
    name: "Half Sleeve T-Shirt",
    description:
      "Classic half sleeve t-shirt with a relaxed fit. Crafted from soft breathable cotton for everyday comfort.",
    category: "t-shirts",
    brand: "UrbanThread",
    tags: ["half-sleeve", "casual", "basics", "everyday"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_001",
        color: { name: "Black", hex: "#000000" },
        images: [
          {
            url: "https://cdn.example.com/halfsleeve-black-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/halfsleeve-black-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "TSH-HSB-S", stock: 40, price: 24.99 },
          { size: "M", sku: "TSH-HSB-M", stock: 60, price: 24.99 },
          { size: "L", sku: "TSH-HSB-L", stock: 50, price: 24.99 },
          { size: "XL", sku: "TSH-HSB-XL", stock: 30, price: 24.99 },
        ],
      },
      {
        variantId: "var_002",
        color: { name: "White", hex: "#ffffff" },
        images: [
          {
            url: "https://cdn.example.com/halfsleeve-white-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/halfsleeve-white-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "TSH-HSW-S", stock: 45, price: 24.99 },
          { size: "M", sku: "TSH-HSW-M", stock: 65, price: 24.99 },
          { size: "L", sku: "TSH-HSW-L", stock: 55, price: 24.99 },
          { size: "XL", sku: "TSH-HSW-XL", stock: 35, price: 24.99 },
        ],
      },
      {
        variantId: "var_003",
        color: { name: "Gray", hex: "#808080" },
        images: [
          {
            url: "https://cdn.example.com/halfsleeve-gray-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/halfsleeve-gray-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "TSH-HSG-S", stock: 35, price: 24.99 },
          { size: "M", sku: "TSH-HSG-M", stock: 55, price: 24.99 },
          { size: "L", sku: "TSH-HSG-L", stock: 45, price: 24.99 },
          { size: "XL", sku: "TSH-HSG-XL", stock: 25, price: 24.99 },
        ],
      },
    ],
    basePrice: 24.99,
    currency: "USD",
    discountPercent: 0,
    sizeGuide: {
      unit: "cm",
      chart: [
        { size: "S", chest: 91, length: 68 },
        { size: "M", chest: 96, length: 71 },
        { size: "L", chest: 101, length: 74 },
        { size: "XL", chest: 106, length: 77 },
      ],
    },
    material: "100% Organic Cotton",
    careInstructions: ["Machine wash cold", "Do not bleach", "Tumble dry low"],
    ratings: { average: 4.5, count: 312 },
    status: "active",
  },

  // ──────────────────────────────────────────────
  // 2. Full Sleeve T-Shirt
  // ──────────────────────────────────────────────
  {
    name: "Full Sleeve T-Shirt",
    description:
      "Premium full sleeve t-shirt with a comfortable regular fit. Ideal for layering or wearing on its own in cooler weather.",
    category: "t-shirts",
    brand: "UrbanThread",
    tags: ["full-sleeve", "long-sleeve", "casual", "layering"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_004",
        color: { name: "Black", hex: "#000000" },
        images: [
          {
            url: "https://cdn.example.com/fullsleeve-black-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/fullsleeve-black-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "TSH-FSB-S", stock: 30, price: 29.99 },
          { size: "M", sku: "TSH-FSB-M", stock: 50, price: 29.99 },
          { size: "L", sku: "TSH-FSB-L", stock: 40, price: 29.99 },
          { size: "XL", sku: "TSH-FSB-XL", stock: 20, price: 29.99 },
        ],
      },
      {
        variantId: "var_005",
        color: { name: "White", hex: "#ffffff" },
        images: [
          {
            url: "https://cdn.example.com/fullsleeve-white-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/fullsleeve-white-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "TSH-FSW-S", stock: 35, price: 29.99 },
          { size: "M", sku: "TSH-FSW-M", stock: 55, price: 29.99 },
          { size: "L", sku: "TSH-FSW-L", stock: 45, price: 29.99 },
          { size: "XL", sku: "TSH-FSW-XL", stock: 25, price: 29.99 },
        ],
      },
      {
        variantId: "var_006",
        color: { name: "Gray", hex: "#808080" },
        images: [
          {
            url: "https://cdn.example.com/fullsleeve-gray-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/fullsleeve-gray-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "TSH-FSG-S", stock: 28, price: 29.99 },
          { size: "M", sku: "TSH-FSG-M", stock: 48, price: 29.99 },
          { size: "L", sku: "TSH-FSG-L", stock: 38, price: 29.99 },
          { size: "XL", sku: "TSH-FSG-XL", stock: 18, price: 29.99 },
        ],
      },
    ],
    basePrice: 29.99,
    currency: "USD",
    discountPercent: 0,
    sizeGuide: {
      unit: "cm",
      chart: [
        { size: "S", chest: 91, length: 70 },
        { size: "M", chest: 96, length: 73 },
        { size: "L", chest: 101, length: 76 },
        { size: "XL", chest: 106, length: 79 },
      ],
    },
    material: "100% Combed Cotton",
    careInstructions: ["Machine wash cold", "Do not bleach", "Hang dry"],
    ratings: { average: 4.6, count: 245 },
    status: "active",
  },

  // ──────────────────────────────────────────────
  // 3. Shirt
  // ──────────────────────────────────────────────
  {
    name: "Shirt",
    description:
      "Classic button-down shirt with a tailored fit. Versatile enough for casual outings or semi-formal occasions.",
    category: "shirts",
    brand: "NovaWear",
    tags: ["button-down", "classic", "smart-casual", "versatile"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_007",
        color: { name: "Black", hex: "#000000" },
        images: [
          {
            url: "https://cdn.example.com/shirt-black-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/shirt-black-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "SHT-CLB-S", stock: 20, price: 44.99 },
          { size: "M", sku: "SHT-CLB-M", stock: 35, price: 44.99 },
          { size: "L", sku: "SHT-CLB-L", stock: 30, price: 44.99 },
          { size: "XL", sku: "SHT-CLB-XL", stock: 15, price: 44.99 },
        ],
      },
      {
        variantId: "var_008",
        color: { name: "White", hex: "#ffffff" },
        images: [
          {
            url: "https://cdn.example.com/shirt-white-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/shirt-white-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "SHT-CLW-S", stock: 25, price: 44.99 },
          { size: "M", sku: "SHT-CLW-M", stock: 40, price: 44.99 },
          { size: "L", sku: "SHT-CLW-L", stock: 35, price: 44.99 },
          { size: "XL", sku: "SHT-CLW-XL", stock: 20, price: 44.99 },
        ],
      },
      {
        variantId: "var_009",
        color: { name: "Gray", hex: "#808080" },
        images: [
          {
            url: "https://cdn.example.com/shirt-gray-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/shirt-gray-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "SHT-CLG-S", stock: 18, price: 44.99 },
          { size: "M", sku: "SHT-CLG-M", stock: 32, price: 44.99 },
          { size: "L", sku: "SHT-CLG-L", stock: 28, price: 44.99 },
          { size: "XL", sku: "SHT-CLG-XL", stock: 12, price: 44.99 },
        ],
      },
    ],
    basePrice: 44.99,
    currency: "USD",
    discountPercent: 0,
    sizeGuide: {
      unit: "cm",
      chart: [
        { size: "S", chest: 92, length: 72 },
        { size: "M", chest: 98, length: 75 },
        { size: "L", chest: 104, length: 78 },
        { size: "XL", chest: 110, length: 81 },
      ],
    },
    material: "100% Premium Cotton Poplin",
    careInstructions: ["Machine wash cold", "Iron on medium heat", "Hang dry"],
    ratings: { average: 4.4, count: 189 },
    status: "active",
  },

  // ──────────────────────────────────────────────
  // 4. Neck Top
  // ──────────────────────────────────────────────
  {
    name: "Neck Top",
    description:
      "Sleek mock neck top in a stretchy ribbed knit. Perfect for layering or wearing solo with a minimal aesthetic.",
    category: "t-shirts",
    brand: "NovaWear",
    tags: ["neck-top", "mock-neck", "ribbed", "minimal"],
    gender: "unisex",
    variants: [
      {
        variantId: "var_010",
        color: { name: "Black", hex: "#000000" },
        images: [
          {
            url: "https://cdn.example.com/necktop-black-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/necktop-black-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "NTP-BLK-S", stock: 25, price: 34.99 },
          { size: "M", sku: "NTP-BLK-M", stock: 40, price: 34.99 },
          { size: "L", sku: "NTP-BLK-L", stock: 35, price: 34.99 },
          { size: "XL", sku: "NTP-BLK-XL", stock: 18, price: 34.99 },
        ],
      },
      {
        variantId: "var_011",
        color: { name: "White", hex: "#ffffff" },
        images: [
          {
            url: "https://cdn.example.com/necktop-white-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/necktop-white-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "NTP-WHT-S", stock: 30, price: 34.99 },
          { size: "M", sku: "NTP-WHT-M", stock: 45, price: 34.99 },
          { size: "L", sku: "NTP-WHT-L", stock: 38, price: 34.99 },
          { size: "XL", sku: "NTP-WHT-XL", stock: 22, price: 34.99 },
        ],
      },
      {
        variantId: "var_012",
        color: { name: "Gray", hex: "#808080" },
        images: [
          {
            url: "https://cdn.example.com/necktop-gray-front.jpg",
            view: "front",
          },
          {
            url: "https://cdn.example.com/necktop-gray-back.jpg",
            view: "back",
          },
        ],
        sizes: [
          { size: "S", sku: "NTP-GRY-S", stock: 22, price: 34.99 },
          { size: "M", sku: "NTP-GRY-M", stock: 38, price: 34.99 },
          { size: "L", sku: "NTP-GRY-L", stock: 32, price: 34.99 },
          { size: "XL", sku: "NTP-GRY-XL", stock: 16, price: 34.99 },
        ],
      },
    ],
    basePrice: 34.99,
    currency: "USD",
    discountPercent: 0,
    sizeGuide: {
      unit: "cm",
      chart: [
        { size: "S", chest: 88, length: 64 },
        { size: "M", chest: 94, length: 67 },
        { size: "L", chest: 100, length: 70 },
        { size: "XL", chest: 106, length: 73 },
      ],
    },
    material: "95% Modal, 5% Elastane",
    careInstructions: ["Machine wash cold", "Do not bleach", "Lay flat to dry"],
    ratings: { average: 4.7, count: 156 },
    status: "active",
  },
];

const seedProducts = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("MONGO_URI is not defined in .env");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("Connected to database");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    const created = await Product.insertMany(products);
    console.log(`Successfully seeded ${created.length} products`);

    await mongoose.disconnect();
    console.log("Disconnected from database");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedProducts();
