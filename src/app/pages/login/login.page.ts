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
  IonIcon
} from '@ionic/angular/standalone';

import {
  eyeOutline,
  eyeOffOutline,
  mailOutline,
  lockClosedOutline,
  locationOutline
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonInput,
    IonButton,
    IonIcon
  ]
})
export class LoginPage {

  showPassword = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    addIcons({
      eyeOutline,
      eyeOffOutline,
      mailOutline,
      lockClosedOutline,
      locationOutline
    });

  }

  togglePassword() {
    this.showPassword.update(value => !value);
  }

  async login() {

    if (this.loginForm.invalid) {
      alert('Preencha todos os campos.');
      return;
    }

    const formValue = this.loginForm.value;

    try {

      const success = await this.authService.login(
        formValue.email!,
        formValue.password!
      );

      if (!success) {
        alert('E-mail ou senha inválidos.');
        return;
      }

      alert('Login realizado com sucesso.');

      this.router.navigate(['/home']);

      console.log('Usuário logado');

    } catch (error) {

      console.error(error);
      alert('Erro ao fazer login. Tente novamente.');

    }

  }

}