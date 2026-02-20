import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ColorFilter } from "../color-filter/color-filter";

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, ColorFilter],
  templateUrl: './product-card.html',
  styles: ``,
})
export class ProductCard {

}
