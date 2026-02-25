import { Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProductServices } from '../../services/product-services';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductVariant } from '../../utils/product-interface';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideMoveRight, lucideVan, lucideWandSparkles } from '@ng-icons/lucide';

@Component({
  selector: 'app-product-details',
  imports: [NgClass, NgIcon],
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
  //  FIXME
  selectedImg = signal<string | undefined>('');

  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private readonly productService: ProductServices,
    activatedRoute: ActivatedRoute,
  ) {
    const { params, queryParams } = activatedRoute.snapshot;
    this.productId.set(params['id']);
    this.routeVariantId.set(queryParams['variant']);
    console.log('id', this.productId());
    console.log('variant', this.routeVariantId());
  }

  loadProduct(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProductById(id).subscribe({
      next: (res) => {
        console.log(res.data);
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
        console.log(this.selectedVariant());
        console.log(this.selectedVariant()?.sizes[0].size);
        this.selectedSize.set(this.selectedVariant()?.sizes[0].size);
        // FIXME
        console.log(this.selectedVariant()?.images[0].url);
        this.selectedImg.set(this.selectedVariant()?.images[0].url);
      },
    });
  }
  ngOnInit(): void {
    this.loadProduct(this.productId());
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
    console.log(this.selectedVariant());
    this.selectedSize.set(variant.sizes[0]?.size);

    if (variant.images.length > 0) {
      this.selectedImg.set(variant.images[0].url);
    }
  }

  selectSize(size: string) {
    this.selectedSize.set(size);
    console.log(this.selectedSize());
  }

  // FIXME
  selectImg(view: string) {
    const res = this.selectedVariant()?.images.filter((el) => el.view === view);
    this.selectedImg.set(res?.at(0)?.url);
    console.log(res?.[0]?.url);
  }
}
