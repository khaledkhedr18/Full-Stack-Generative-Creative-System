import { Component } from '@angular/core';
import { Button } from '../../components/button/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Divider } from '../../components/divider/divider';
import { FormInput } from '../../components/form-input/form-input';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [Button, FontAwesomeModule, Divider, FormInput, RouterLink],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
  faFacebook = faFacebook;
  faEnvelope = faEnvelope;
  faLock = faLock;
}
