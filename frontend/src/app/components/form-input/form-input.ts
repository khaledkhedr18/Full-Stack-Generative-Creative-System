import { Component, computed, Input, signal } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-form-input',
  imports: [FontAwesomeModule],
  templateUrl: './form-input.html',
  styles: ``,
})
export class FormInput {
  @Input() inputId: string = '';
  @Input() label: string = '';
  @Input() icon: IconDefinition | undefined = undefined;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() parent: string = '';

  isPasswordVisible = signal(false);

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  inputType = computed(() => {
    if (this.type !== 'password') return this.type;
    return this.isPasswordVisible() ? 'text' : 'password';
  });

  toggleVisibility() {
    this.isPasswordVisible.update((v) => !v);
  }
}
