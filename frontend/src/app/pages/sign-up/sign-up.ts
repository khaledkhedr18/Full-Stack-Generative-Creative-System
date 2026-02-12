import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Button } from '../../components/button/button';
import { Divider } from '../../components/divider/divider';
import { faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FormInput } from '../../components/form-input/form-input';

@Component({
  selector: 'app-sign-up',
  imports: [FontAwesomeModule, Button, Divider, FormInput],
  templateUrl: './sign-up.html',
  styles: ``,
})
export class SignUp {
  faFacebook = faFacebook;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faLock = faLock;
}
