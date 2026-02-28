import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faHouse } from '@fortawesome/free-regular-svg-icons';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-error',
  imports: [RouterLink, FaIconComponent],
  templateUrl: './error.html',
  styles: ``,
})
export class Error {
  faHouse = faHouse;
  faBagShopping = faBagShopping;
}
