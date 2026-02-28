import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import {
  lucideBot,
  lucideCircleCheck,
  lucideKeyboard,
  lucideMoveRight,
  lucidePrinter,
  lucideSparkles,
  lucideVan,
} from '@ng-icons/lucide';
import { ProductServices } from '../../services/product-services';
import { Product } from '../../utils/product-interface';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard, NgIcon],
  providers: [
    provideIcons({
      lucideSparkles,
      lucideCircleCheck,
      lucideBot,
      lucideKeyboard,
      lucidePrinter,
      lucideVan,
      lucideMoveRight,
    }),
  ],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  constructor(private readonly productService: ProductServices) {}

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProducts(1, 4).subscribe({
      next: (res) => {
        // console.log(res.data);
        this.products.set(res.data);
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
}
