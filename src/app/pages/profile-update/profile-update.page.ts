import { Component, OnInit } from '@angular/core';

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
  personOutline,
  mailOutline,
  locationOutline,
  arrowBackOutline
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-updateProfile',
  templateUrl: './profile-update.page.html',
  styleUrls: ['./profile-update.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonIcon
  ]
})
export class ProfileUpdatePage implements OnInit {

  updateProfileForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {

    addIcons({
      personOutline,
      mailOutline,
      locationOutline,
      arrowBackOutline
    });

  }


  async ngOnInit() {

    const loggedUser = await this.userService.findLoggedUser();

    if (loggedUser) {
      this.updateProfileForm.patchValue({
        name: loggedUser.name,
        email: loggedUser.email
      });
    }

  }


  async updateProfile() {

    if (this.updateProfileForm.get('name')?.invalid) {
      alert('Digite seu nome completo.');
      return;
    }

    if (this.updateProfileForm.get('email')?.hasError('required')) {
      alert('Digite seu e-mail.');
      return;
    }

    if (this.updateProfileForm.get('email')?.hasError('email')) {
      alert('Digite um e-mail válido.');
      return;
    }

    const formValue = this.updateProfileForm.value;

    const name = formValue.name!;
    const email = formValue.email!;

    try {

      const existEmail = await this.userService.emailAlreadyExistsForAnotherUser(email);

      if (existEmail) {
        alert('Este e-mail já está cadastrado.');
        return;
      }

      const success = await this.userService.updateUser(name, email);

      if (!success) {
        alert('Usuário não encontrado.');
        return;
      }

      alert('Perfil atualizado com sucesso.');

      this.router.navigate(['/profile']);

    } catch (error) {

      console.error(error);
      alert('Erro ao atualizar perfil. Tente novamente.');

    }

  }

  goBack() {
    this.router.navigate(['/profile']);
  }

}