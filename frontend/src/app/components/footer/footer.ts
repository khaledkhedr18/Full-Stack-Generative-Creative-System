import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFacebook, lucideInstagram, lucideMoveRight, lucideTwitter } from '@ng-icons/lucide';

@Component({
  selector: 'app-footer',
  imports: [NgIcon],
  providers: [provideIcons({ lucideFacebook, lucideInstagram, lucideTwitter, lucideMoveRight })],
  templateUrl: './footer.html',
  styles: ``,
})
export class Footer {}
