// AI Model Status
export interface AiModelStatus {
  loaded: boolean;
  model: string;
}

export interface AiStatusResponse {
  success: boolean;
  data: AiModelStatus;
}

// Generate Design
export interface GenerateDesignRequest {
  productId: string;
  variantId: string;
  prompt: string;
  strength: number;
}

export interface DesignProduct {
  name: string;
  color: string;
}

export interface GeneratedDesign {
  designId: string;
  product: DesignProduct;
  prompt: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  fee: number;
  status: string;
}

export interface GenerateDesignResponse {
  success: boolean;
  message: string;
  data: GeneratedDesign;
}

// Retry Design
export interface RetryDesignResponse {
  success: boolean;
  message?: string;
  data?: GeneratedDesign;
  error?: {
    statusCode: number;
    status: string;
    isOperational: boolean;
  };
  stack?: string;
}

// Art Styles
export type ArtStyle = 'realistic' | 'cyberpunk' | 'oilPainting' | 'minimalist' | 'sketch';

export interface ArtStyleConfig {
  id: ArtStyle;
  label: string;
  promptSuffix: string;
}
