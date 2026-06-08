import { Component, signal } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonCheckbox
} from '@ionic/angular/standalone';

import {
  eyeOutline,
  eyeOffOutline,
  personOutline,
  mailOutline,
  lockClosedOutline,
  locationOutline
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonCheckbox
  ]
})
export class SignupPage {

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  signupForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    terms: [false, [Validators.requiredTrue]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    addIcons({
      eyeOutline,
      eyeOffOutline,
      personOutline,
      mailOutline,
      lockClosedOutline,
      locationOutline
    });

  }

  togglePassword() {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update(value => !value);
  }

  async signUp() {

    if (this.signupForm.get('name')?.invalid) {
      alert('Digite seu nome completo.');
      return;
    }

    if (this.signupForm.get('email')?.hasError('required')) {
      alert('Digite seu e-mail.');
      return;
    }

    if (this.signupForm.get('email')?.hasError('email')) {
      alert('Digite um e-mail válido.');
      return;
    }

    if (this.signupForm.get('password')?.hasError('required')) {
      alert('Digite sua senha.');
      return;
    }

    if (this.signupForm.get('password')?.hasError('minlength')) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (this.signupForm.get('confirmPassword')?.invalid) {
      alert('Confirme sua senha.');
      return;
    }

    if (this.signupForm.get('terms')?.invalid) {
      alert('Você precisa aceitar os termos.');
      return;
    }

    const formValue = this.signupForm.value;

    if (formValue.password !== formValue.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    try {

      const success = await this.authService.register({
        name: formValue.name!,
        email: formValue.email!,
        password: formValue.password!
      });

      if (!success) {
        alert('Este e-mail já está cadastrado.');
        return;
      }

      alert('Conta criada com sucesso.');

      this.router.navigate(['/login']);

    } catch (error) {

      console.error(error);
      alert('Erro ao criar conta. Tente novamente.');

    }

  }

}