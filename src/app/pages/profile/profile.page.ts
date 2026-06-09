import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';

import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

import { FavoriteService } from '../../services/favorite.service';

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
      value: 0,
      icon: 'location-outline'
    },
    {
      label: 'Avaliações',
      value: 0,
      icon: 'star-outline'
    },
    {
      label: 'Favoritos',
      value: '---',
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
    private favoriteService: FavoriteService,
    private router: Router,
    private cdr: ChangeDetectorRef
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

    const loggedUser =
      await this.authService.getLoggedUser();

    this.user.set(loggedUser);

    const favorites =
      await this.favoriteService.getFavorites();

    console.log('Favoritos:', favorites.length);

    this.stats[2].value =
      favorites.length;

    console.log('Stats:', this.stats);

  }

  async ionViewWillEnter() {

    const loggedUser =
      await this.authService.getLoggedUser();

    this.user.set(loggedUser);

    const favorites =
      await this.favoriteService.getFavorites();

    this.stats[2].value =
      favorites.length;

    this.cdr.detectChanges();

  }

  logout() {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}