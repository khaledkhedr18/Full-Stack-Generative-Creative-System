import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-divider',
  imports: [],
  templateUrl: './divider.html',
  styles: ``,
})
export class Divider {
  @Input() label: string = '';
}
