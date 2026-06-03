import { Component } from '@angular/core';


import {
  IonIcon
} from '@ionic/angular/standalone';

import {
  homeOutline,
  home,
  mapOutline,
  map,
  heartOutline,
  heart,
  personOutline,
  person
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

import {
  Router,
  RouterLink
} from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    RouterLink
]
})
export class BottomNavComponent {

  navItems = [
    {
      label: 'Início',
      path: '/home',
      icon: 'home-outline',
      activeIcon: 'home'
    },
    {
      label: 'Mapa',
      path: '/map',
      icon: 'map-outline',
      activeIcon: 'map'
    },
    {
      label: 'Favoritos',
      path: '/favorites',
      icon: 'heart-outline',
      activeIcon: 'heart'
    },
    {
      label: 'Perfil',
      path: '/profile',
      icon: 'person-outline',
      activeIcon: 'person'
    }
  ];

  constructor(
    public router: Router
  ) {

    addIcons({
      homeOutline,
      home,
      mapOutline,
      map,
      heartOutline,
      heart,
      personOutline,
      person
    });

  }

  isActive(path: string): boolean {

    return this.router.url === path;

  }

}