import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-filter',
  imports: [],
  templateUrl: './category-filter.html',
  styles: ``,
})
export class CategoryFilter {
  @Input() inputId = '';
  @Input() label = '';
  @Input() length = '';
}
