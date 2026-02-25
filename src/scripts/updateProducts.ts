import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Inline the schema to keep the script self-contained
const variantImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    view: { type: String, required: true },
  },
  { _id: false },
);

const variantSizeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    sku: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const variantColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
  },
  { _id: false },
);

const variantSchema = new mongoose.Schema(
  {
    variantId: { type: String, required: true },
    color: { type: variantColorSchema, required: true },
    images: { type: [variantImageSchema] },
    sizes: { type: [variantSizeSchema], required: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    category: String,
    brand: String,
    tags: [String],
    gender: String,
    variants: [variantSchema],
    basePrice: Number,
    currency: String,
    discountPercent: Number,
    sizeGuide: mongoose.Schema.Types.Mixed,
    material: String,
    careInstructions: [String],
    ratings: mongoose.Schema.Types.Mixed,
    status: String,
  },
  { timestamps: true, strict: false },
);

const Product = mongoose.model("Product", productSchema);

// ──── Configuration ────
const PORT = process.env.PORT || 3000;
const BASE_URL =
  process.env.IMAGE_BASE_URL || `http://localhost:${PORT}/uploads/products`;

async function updateImageUrls(): Promise<void> {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not set in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB\n");

    const products = await Product.find({});
    console.log(`Found ${products.length} products to process\n`);

    let totalUpdated = 0;
    let totalImages = 0;

    for (const product of products) {
      let modified = false;

      for (const variant of product.variants) {
        for (const image of variant.images) {
          totalImages++;

          // Replace cdn.example.com URLs with local server URLs
          if (image.url.includes("cdn.example.com")) {
            const filename = image.url.split("/").pop();
            const newUrl = `${BASE_URL}/${filename}`;
            console.log(
              `  📸 ${product.name} [${variant.color.name}] ${image.view}`,
            );
            console.log(`     OLD: ${image.url}`);
            console.log(`     NEW: ${newUrl}\n`);
            image.url = newUrl;
            modified = true;
          }
        }
      }

      if (modified) {
        await product.save();
        totalUpdated++;
        console.log(`  ✅ Saved: ${product.name}\n`);
      } else {
        console.log(`  ⏭️  Skipped (already updated): ${product.name}\n`);
      }
    }

    console.log("═══════════════════════════════════════");
    console.log(`🎉 Migration Complete!`);
    console.log(`   Products updated: ${totalUpdated}/${products.length}`);
    console.log(`   Total images processed: ${totalImages}`);
    console.log(`   Base URL: ${BASE_URL}`);
    console.log("═══════════════════════════════════════");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

updateImageUrls();
