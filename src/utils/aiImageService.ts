import axios from "axios";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import config from "../config/env.js";
import AppError from "./AppError.js";

const DESIGNS_DIR = path.join("uploads", "designs");

/**
 * @desc Load an image from a local path or URL and return it as a base64 string
 * @param imageSource - Local file path or remote URL
 * @returns Base64-encoded PNG string
 */
async function loadImageAsBase64(imageSource: string): Promise<string> {
  let rawBuffer: Buffer;

  if (imageSource.startsWith("http://") || imageSource.startsWith("https://")) {
    console.log(`Downloading product image from: ${imageSource}`);
    const response = await axios.get(imageSource, {
      responseType: "arraybuffer",
      timeout: 30000,
    });
    rawBuffer = Buffer.from(response.data);
  } else {
    const localPath = imageSource.startsWith("/")
      ? imageSource.substring(1)
      : imageSource;

    console.log(`Reading local product image: ${localPath}`);

    if (!fs.existsSync(localPath)) {
      throw new AppError(`Product image not found at: ${localPath}`, 404);
    }

    rawBuffer = fs.readFileSync(localPath);
  }

  const processedBuffer = await sharp(rawBuffer)
    .resize(768, 768, { fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();

  return processedBuffer.toString("base64");
}

/**
 * @desc Send a prompt to a Hugging Face model endpoint for image generation
 * @param modelUrl - Full inference API URL
 * @param base64Image - Base64-encoded source image (used by img2img models)
 * @param prompt - Text prompt describing the design
 * @param strength - Denoising strength for img2img models
 * @returns Raw image buffer from the model response
 */
async function callModel(
  modelUrl: string,
  base64Image: string,
  prompt: string,
  strength: number,
): Promise<Buffer> {
  const isTextToImage = modelUrl.includes("FLUX");

  const payload = isTextToImage
    ? { inputs: prompt }
    : {
        inputs: prompt,
        parameters: {
          image: base64Image,
          strength: strength,
          guidance_scale: 7.5,
          num_inference_steps: 30,
        },
      };

  const response = await axios.post(modelUrl, payload, {
    headers: {
      Authorization: `Bearer ${config.huggingfaceApiToken}`,
      "Content-Type": "application/json",
      Accept: "image/png",
    },
    responseType: "arraybuffer",
    timeout: 180000,
  });

  return Buffer.from(response.data);
}

/**
 * @desc Generate a custom design on a product image using AI image editing
 * @param productImageSource - Local path or URL to the product image
 * @param prompt - User's design description (e.g., "a dragon on the chest")
 * @param productName - Product name (e.g., "Full Sleeve T-Shirt")
 * @param colorName - Variant color name (e.g., "Black")
 * @param strength - Denoising strength for fallback SD models (0.2-0.8)
 * @returns Filename of the saved design image
 */
export async function generateDesignImage(
  productImageSource: string,
  prompt: string,
  productName: string,
  colorName: string,
  strength: number = 0.55,
): Promise<string> {
  console.log(`AI design generation started - ${productName} (${colorName})`);
  console.log(`User prompt: "${prompt}"`);

  const base64Image = await loadImageAsBase64(productImageSource);
  console.log(
    `Image loaded (${(base64Image.length / 1024).toFixed(0)}KB base64)`,
  );

  const designPrompt = [
    `A ${colorName.toLowerCase()} ${productName.toLowerCase()}`,
    `with a custom printed design on the front: ${prompt}.`,
    `Keep the garment shape, color, folds, and background exactly the same.`,
    `Photorealistic product photography, high quality.`,
  ].join(" ");

  const modelsToTry = [config.primaryModel, ...config.fallbackModels];
  let resultBuffer: Buffer | null = null;
  let lastError: any = null;
  let usedModel = "";

  for (const modelUrl of modelsToTry) {
    const modelName = modelUrl.split("/").pop();
    const promptToUse = designPrompt;

    try {
      console.log(`Trying model: ${modelName}`);
      resultBuffer = await callModel(
        modelUrl,
        base64Image,
        promptToUse,
        strength,
      );
      usedModel = modelName!;
      console.log(`${modelName} responded successfully`);
      break;
    } catch (error: any) {
      lastError = error;
      const status = error.response?.status;

      if (status === 503) {
        const wait = error.response?.data?.estimated_time || "unknown";
        console.log(
          `${modelName} is loading (cold start ~${wait}s). Trying next model`,
        );
      } else if (status === 429) {
        console.log(`${modelName} rate limited. Trying next model`);
      } else {
        console.log(
          `${modelName} failed (${status || error.message}). Trying next model`,
        );
      }
      continue;
    }
  }

  if (!resultBuffer) {
    if (lastError?.response?.status === 503) {
      throw new AppError(
        "AI model is warming up. Please try again in about 60 seconds",
        503,
      );
    }
    throw new AppError(
      `All AI models failed. Last error: ${lastError?.message || "Unknown"}`,
      502,
    );
  }

  const processedBuffer = await sharp(resultBuffer)
    .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();

  const filename = `design-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
  const filepath = path.join(DESIGNS_DIR, filename);

  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, processedBuffer);

  console.log(
    `Saved design to: ${filepath} (${(processedBuffer.length / 1024).toFixed(0)}KB) - Model: ${usedModel}`,
  );

  return filename;
}

/**
 * @desc Check if the primary AI model is loaded and ready to accept requests
 * @returns Object with load status, estimated wait time, and model name
 */
export async function checkModelStatus(): Promise<{
  loaded: boolean;
  estimatedTime?: number;
  model: string;
}> {
  const modelName = config.primaryModel.split("/").pop() || "unknown";

  if (!config.primaryModel) {
    throw new AppError(
      "PRIMARY_MODEL environment variable is not configured",
      500,
    );
  }

  try {
    await axios.get(config.primaryModel, {
      headers: {
        Authorization: `Bearer ${config.huggingfaceApiToken}`,
      },
    });
    return { loaded: true, model: modelName };
  } catch (error: any) {
    if (error.response?.status === 503) {
      return {
        loaded: false,
        estimatedTime: error.response?.data?.estimated_time || 60,
        model: modelName,
      };
    }
    if (error.response?.status === 410 || error.response?.status === 404) {
      return {
        loaded: false,
        estimatedTime: 0,
        model: modelName,
      };
    }
    throw new AppError(
      `Failed to check model status: ${error.message}`,
      error.response?.status || 500,
    );
  }
}
