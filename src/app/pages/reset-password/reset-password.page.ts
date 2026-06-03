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
  lockClosedOutline,
  locationOutline
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonIcon
  ]
})
export class ResetPasswordPage {

  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  resetPasswordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {

    addIcons({
      eyeOutline,
      eyeOffOutline,
      lockClosedOutline,
      locationOutline
    });

  }

  toggleCurrentPassword() {
    this.showCurrentPassword.update(value => !value);
  }

  toggleNewPassword() {
    this.showNewPassword.update(value => !value);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update(value => !value);
  }

  async updatePassword() {

    if (this.resetPasswordForm.invalid) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const formValue = this.resetPasswordForm.value;

    const currentPassword = formValue.currentPassword!;
    const newPassword = formValue.newPassword!;
    const confirmPassword = formValue.confirmPassword!;

    try {

      const loggedUser = await this.userService.findLoggedUser();

      if (!loggedUser) {
        alert('Usuário não encontrado.');
        return;
      }

      if (loggedUser.password !== currentPassword) {
        alert('Senha atual incorreta.');
        return;
      }

      if (newPassword !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
      }

      const success = await this.userService.updatePassword(newPassword);

      if (!success) {
        alert('Erro ao alterar senha.');
        return;
      }

      alert('Senha alterada com sucesso.');

      this.router.navigate(['/profile']);

    } catch (error) {

      console.error(error);
      alert('Erro ao alterar senha. Tente novamente.');

    }

  }

}