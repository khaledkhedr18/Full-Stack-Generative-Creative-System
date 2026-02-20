import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { ProductCard } from '../../components/product-card/product-card';
import { CategoryFilter } from '../../components/category-filter/category-filter';
import { ColorFilter } from '../../components/color-filter/color-filter';
import { SizeFilter } from '../../components/size-filter/size-filter';
import { Button } from '../../components/button/button';
import { NgTemplateOutlet } from '@angular/common';

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
}
