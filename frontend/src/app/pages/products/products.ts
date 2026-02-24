import { Component, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { ProductCard } from '../../components/product-card/product-card';
import { CategoryFilter } from '../../components/category-filter/category-filter';
import { ColorFilter } from '../../components/color-filter/color-filter';
import { SizeFilter } from '../../components/size-filter/size-filter';
import { Button } from '../../components/button/button';
import { NgTemplateOutlet } from '@angular/common';
import { ProductServices } from '../../services/product-services';
import { Product } from '../../utils/product-interface';

@Component({
  selector: 'app-products',
  imports: [
    FontAwesomeModule,
    ProductCard,
    CategoryFilter,
    ColorFilter,
    SizeFilter,
    Button,
    NgTemplateOutlet,
  ],
  templateUrl: './products.html',
  styles: ``,
})
export class Products {
  faFilter = faFilter;
  faWandMagicSparkles = faWandMagicSparkles;

  // ////
  constructor(private readonly productService: ProductServices) {}

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  currentPage = signal(1);
  totalPages = signal(1);
  total = signal(0);

  loadProducts(page = 1): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProducts(page).subscribe({
      next: (res) => {
        console.log(res.data);
        this.products.set(res.data);
        this.currentPage.set(res.page);
        this.totalPages.set(res.pages);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load products. Please try again.');
        this.loading.set(false);
        console.log(err);
      },
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (this.currentPage() === page) {
      return;
    }
    if (page >= 1 && page <= this.totalPages()) {
      this.loadProducts(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
