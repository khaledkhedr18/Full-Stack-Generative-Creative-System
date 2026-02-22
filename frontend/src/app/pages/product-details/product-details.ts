import { Component, ElementRef, ViewChild } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faWandMagicSparkles, faArrowRight, faTruck } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [FaIconComponent, NgClass],
  templateUrl: './product-details.html',
  styles: ``,
})
export class ProductDetails {
  faWandMagicSparkles = faWandMagicSparkles;
  faHeart = faHeart;
  faArrowRight = faArrowRight;
  faTruck = faTruck;

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
}
