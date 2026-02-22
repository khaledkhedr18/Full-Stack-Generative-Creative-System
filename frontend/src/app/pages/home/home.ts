import { Component } from '@angular/core';
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
export class Home {}
