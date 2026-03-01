import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHandbag, lucideHouse } from '@ng-icons/lucide';

@Component({
  selector: 'app-error',
  imports: [RouterLink, NgIcon],
  providers: [provideIcons({ lucideHouse, lucideHandbag })],
  templateUrl: './error.html',
  styles: ``,
})
export class Error {}
