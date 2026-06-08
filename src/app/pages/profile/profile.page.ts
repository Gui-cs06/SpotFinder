import { Component, OnInit, signal } from '@angular/core';

import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

import {
  personOutline,
  settingsOutline,
  notificationsOutline,
  locationOutline,
  starOutline,
  heartOutline,
  logOutOutline,
  informationCircleOutline,
  chevronForwardOutline
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

import { Router } from '@angular/router';

import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    BottomNavComponent
  ]
})
export class ProfilePage implements OnInit {

  user = signal<User | null>(null);

  stats = [
    {
      label: 'Lugares Visitados',
      value: 24,
      icon: 'location-outline'
    },
    {
      label: 'Avaliações',
      value: 12,
      icon: 'star-outline'
    },
    {
      label: 'Favoritos',
      value: 8,
      icon: 'heart-outline'
    }
  ];

  menuItems = [
    {
      icon: 'settings-outline',
      label: 'Configurações'
    },
    {
      icon: 'notifications-outline',
      label: 'Notificações'
    },
    {
      icon: 'location-outline',
      label: 'Configurações de Localização'
    },
    {
      icon: 'star-outline',
      label: 'Minhas Avaliações'
    },
    {
      icon: 'heart-outline',
      label: 'Lugares Salvos'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    addIcons({
      personOutline,
      settingsOutline,
      notificationsOutline,
      locationOutline,
      starOutline,
      heartOutline,
      logOutOutline,
      informationCircleOutline,
      chevronForwardOutline
    });

  }

async ngOnInit() {
  const loggedUser = await this.authService.getLoggedUser();

  this.user.set(loggedUser);

  console.log(this.user());
}

  logout() {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}