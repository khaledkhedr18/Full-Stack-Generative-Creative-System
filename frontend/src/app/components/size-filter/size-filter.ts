import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-size-filter',
  imports: [],
  templateUrl: './size-filter.html',
  styles: ``,
})
export class SizeFilter {
  @Input() size = ""
}
