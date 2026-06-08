import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  shareSocialOutline,
  heartOutline,
  star,
  navigateOutline,
  callOutline
} from 'ionicons/icons';

import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class PlaceDetailPage {

  place: any;

  reviews = [
    {
      name: 'Sara',
      rating: 5,
      date: 'há 2 dias',
      text: 'Lugar incrível! A atmosfera é ótima e o serviço é excelente.'
    },
    {
      name: 'Rodrigo',
      rating: 4,
      date: 'há 1 semana',
      text: 'Adorei minha visita. Definitivamente voltaria novamente.'
    },
    {
      name: 'André',
      rating: 5,
      date: 'há 2 semanas',
      text: 'Um dos melhores lugares da região. Altamente recomendado.'
    }
  ];

  constructor() {

    addIcons({
      arrowBackOutline,
      shareSocialOutline,
      heartOutline,
      star,
      navigateOutline,
      callOutline
    });

    this.place = history.state.place;

    console.log('Place recebido:', this.place);

  }

  goBack() {

    history.back();

  }

  openDirections() {

    if (!this.place) {
      return;
    }

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${this.place.latitude},${this.place.longitude}`,
      '_blank'
    );

  }

  callPlace() {

    if (!this.place?.phone) {
      return;
    }

    window.open(
      `tel:${this.place.phone}`,
      '_self'
    );

  }

  sharePlace() {

    if (!navigator.share) {
      return;
    }

    navigator.share({
      title: this.place?.name,
      text: this.place?.category,
      url: window.location.href
    });

  }

  toggleFavorite() {

    console.log('Favoritar local');

  }

}