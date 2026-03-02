import { Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProductServices } from '../../services/product-services';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductVariant } from '../../utils/product-interface';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideMoveRight, lucideVan, lucideWandSparkles } from '@ng-icons/lucide';
import { WishlistService } from '../../services/wishlist-service';
import { WishlistItem } from '../../utils/wishlist-interface';
import { HotToastService } from '@ngxpert/hot-toast';
import { finalize } from 'rxjs';
import { AiService } from '../../services/ai-service';
import { ArtStyle, ArtStyleConfig, GeneratedDesign } from '../../utils/ai-interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [NgClass, NgIcon, FormsModule],
  providers: [
    provideIcons({
      lucideWandSparkles,
      lucideMoveRight,
      lucideHeart,
      lucideVan,
    }),
  ],
  templateUrl: './product-details.html',
  styles: ``,
})
export class ProductDetails {
  @ViewChild('imageWrapper') imageWrapper!: ElementRef<HTMLDivElement>;

  isZoomed = false;
  zoomOrigin = '50% 50%';

  onMouseMove(event: MouseEvent) {
    this.isZoomed = true;
    const container = this.imageWrapper.nativeElement;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    this.zoomOrigin = `${xPercent}% ${yPercent}%`;
  }

  onMouseLeave() {
    this.isZoomed = false;
  }

  // my work
  productId = signal('');
  routeVariantId = signal('');

  product = signal<Product>({} as Product);
  selectedVariant = signal<ProductVariant | null>(null);
  selectedSize = signal<string | undefined>('');
  // selectedImg = signal<string | undefined>('');
  selectedImg = signal<any>('');

  loading = signal(true);
  error = signal<string | null>(null);

  wishlistItems = signal<WishlistItem[]>([]);
  loadingWishlist = signal(false);

  constructor(
    private readonly productService: ProductServices,
    private wishlistService: WishlistService,
    activatedRoute: ActivatedRoute,
    private toast: HotToastService,
    private aiDesignService: AiService,
  ) {
    const { params, queryParams } = activatedRoute.snapshot;
    this.productId.set(params['id']);
    this.routeVariantId.set(queryParams['variant']);
  }

  loadProduct(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProductById(id).subscribe({
      next: (res) => {
        this.product.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load product. Please try again.');
        this.loading.set(false);
        console.log(err);
      },
      complete: () => {
        if (!this.routeVariantId()) {
          this.selectedVariant.set(this.product().variants[0]);
        } else {
          const [res] = this.product().variants.filter(
            (el) => el.variantId === this.routeVariantId(),
          );
          this.selectedVariant.set(res);
        }
        this.selectedSize.set(this.selectedVariant()?.sizes[0].size);
        this.selectedImg.set(this.selectedVariant()?.images[0].url);
      },
    });
  }

  ngOnInit(): void {
    this.loadProduct(this.productId());
    this.loadWishlist();
  }

  stars = computed(() => {
    const p = this.product();

    const rating = p?.ratings?.average ?? 0;

    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1;
      if (rating >= starNumber) return 'full';
      if (rating >= starNumber - 0.5) return 'half';
      return 'empty';
    });
  });

  selectVariant(variant: ProductVariant) {
    this.selectedVariant.set(variant);
    this.selectedSize.set(variant.sizes[0]?.size);

    if (variant.images.length > 0) {
      this.selectedImg.set(variant.images[0].url);
    }
  }

  selectSize(size: string) {
    this.selectedSize.set(size);
  }

  // selectImg(view: string) {
  //   const res = this.selectedVariant()?.images.filter((el) => el.view === view);
  //   this.selectedImg.set(res?.at(0)?.url);
  //   this.selectedView(view);

  //   // this.generatedDesign()?.generatedImageUrl
  // }
  selectImg(view: string) {
    // Keep track of the current view
    this.designView.set(view);

    // 1. Check if we have an AI design for this view
    const aiDesign = this.generatedDesigns()[view];

    if (aiDesign && aiDesign.status === 'completed') {
      this.selectedImg.set(aiDesign.generatedImageUrl);
    } else {
      // 2. Fallback to original product image
      const originalImg = this.selectedVariant()?.images.find((el) => el.view === view);
      this.selectedImg.set(originalImg?.url);
    }
  }

  // wishlist
  isFavorite = computed(() => {
    const currentId = this.productId();
    const items = this.wishlistItems();

    return items.some((item) => item.product._id === currentId || item.product.id === currentId);
  });

  loadWishlist(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.wishlistItems.set(res.data.items);
        }
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
      },
    });
  }

  addToWishlist(productId: string) {
    this.loadingWishlist.set(true);
    this.wishlistService
      .addToWishlist(productId)
      .pipe(
        this.toast.observe({
          loading: 'Adding your product...',
          success: 'Product added successfully to your wishlist!',
          error: 'Could not add to wishlist',
        }),
        finalize(() => this.loadingWishlist.set(false)),
      )
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.wishlistItems.set(res.data.items);
          }
          this.loadingWishlist.set(false);
        },
        error: (err) => {
          this.loadingWishlist.set(false);
          console.log(err);
        },
      });
  }

  ///ai
  artStyles: ArtStyleConfig[] = [
    { id: 'realistic', label: 'Realistic', promptSuffix: 'realistic style' },
    { id: 'cyberpunk', label: 'Cyberpunk', promptSuffix: 'cyberpunk style' },
    { id: 'oilPainting', label: 'Oil Painting', promptSuffix: 'oil painting style' },
    { id: 'minimalist', label: 'Minimalist', promptSuffix: 'minimalist style' },
    { id: 'sketch', label: 'Sketch', promptSuffix: 'sketch style' },
  ];

  // AI Design Generation
  designPrompt = signal('');
  selectedArtStyle = signal<ArtStyle>('realistic');
  generatingDesign = signal(false);
  // generatedDesign = signal<GeneratedDesign | null>(null);
  generatedDesigns = signal<Record<string, GeneratedDesign>>({});
  designError = signal<string | null>(null);
  designView = signal<string>('front');

  // AI Design Methods
  selectArtStyle(style: ArtStyle) {
    this.selectedArtStyle.set(style);
    console.log(this.selectedArtStyle());
  }

  selectedView(view: string) {
    this.designView.set(view);
    console.log(this.designView());
  }

  generateDesign() {
    console.log(this.designPrompt());
    // Validate inputs
    if (!this.designPrompt().trim()) {
      this.toast.error('Please enter a design description');
      return;
    }

    if (!this.selectedVariant()) {
      this.toast.error('Please select a product variant');
      return;
    }

    this.generatingDesign.set(true);
    this.designError.set(null);

    // Get the art style suffix
    const artStyleConfig = this.artStyles.find((style) => style.id === this.selectedArtStyle());
    const promptWithStyle = artStyleConfig
      ? `${this.designPrompt()}, ${artStyleConfig.promptSuffix}, on the ${this.designView()} of the item`
      : this.designPrompt();

    const request = {
      productId: this.productId(),
      variantId: this.selectedVariant()!.variantId,
      prompt: promptWithStyle,
      strength: 0.55,
    };

    this.aiDesignService
      .generateDesign(request)
      .pipe(
        this.toast.observe({
          loading: 'Generating your design...',
          success: (res) => `Design generated! Fee: $${res.data.fee}`,
          error: 'Failed to generate design',
        }),
        finalize(() => this.generatingDesign.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const key = `${this.selectedVariant()?.variantId}_${this.designView()}`;

            this.generatedDesigns.update((prev) => ({
              ...prev,
              [key]: response.data,
            }));

            if (response.data.status === 'completed') {
              this.selectedImg.set(response.data.generatedImageUrl);
            }
          }
        },
        // next: (response) => {
        //   if (response.success && response.data) {
        //     this.generatedDesigns.update((prev) => ({
        //       ...prev,
        //       [this.designView()]: response.data,
        //     }));
        //     // Update the selected image to show the generated design
        //     if (response.data.status === 'completed') {
        //       this.selectedImg.set(response.data.generatedImageUrl);
        //     } else if (response.data.status === 'failed') {
        //       this.designError.set(
        //         'Design generation failed. You can retry using the button below.',
        //       );
        //     }
        //   }
        // },
        error: (err) => {
          console.error('Design generation error:', err);
          this.designError.set(
            err.error?.message || 'Failed to generate design. Please try again.',
          );
        },
      });
  }
}
