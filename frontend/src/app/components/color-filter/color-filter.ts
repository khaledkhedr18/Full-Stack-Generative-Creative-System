import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-color-filter',
  imports: [NgClass],
  templateUrl: './color-filter.html',
  styles: ``,
})
export class ColorFilter {
  @Input() color = '';
  @Input() type: 'checkbox' | 'radio' = 'checkbox';
  @Input() groupName: string = 'colorGroup';
}
