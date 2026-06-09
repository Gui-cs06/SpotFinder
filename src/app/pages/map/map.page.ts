import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';

import {
  searchOutline,
  listOutline,
  navigateOutline
} from 'ionicons/icons';

import {
  IonContent,
  IonIcon,
  IonInput
} from '@ionic/angular/standalone';

import { Component, OnInit } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';

import maplibregl from 'maplibre-gl';

import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonInput,
    CommonModule,
    FormsModule,
    BottomNavComponent
  ]
})
export class MapPage implements OnInit {

  private map!: maplibregl.Map;

  private currentLat!: number;
  private currentLng!: number;

  private API_KEY =
    '892aa90343044f81abb9cfeab5eeedc4';

  places: any[] = [];

  private markers: maplibregl.Marker[] = [];

  constructor(
    private router: Router
  ) {

    addIcons({
      searchOutline,
      listOutline,
      navigateOutline
    });

  }

  async ngOnInit() {

    const position =
      await Geolocation.getCurrentPosition();

    this.currentLat =
      position.coords.latitude;

    this.currentLng =
      position.coords.longitude;

    setTimeout(() => {
      this.initializeMap();
    });

  }

  initializeMap() {

    this.map = new maplibregl.Map({

      container: 'map',

      style:
        `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${this.API_KEY}`,

      center: [
        this.currentLng,
        this.currentLat
      ],

      zoom: 15

    });

    new maplibregl.Marker({
      color: '#2563eb'
    })
      .setLngLat([
        this.currentLng,
        this.currentLat
      ])
      .addTo(this.map);

    this.map.on('load', () => {

      this.loadPlaces(
        this.currentLat,
        this.currentLng
      );

    });

  }

  goToMyLocation() {

    this.map.flyTo({
      center: [
        this.currentLng,
        this.currentLat
      ],
      zoom: 15
    });

  }

  searchThisArea() {

    const center =
      this.map.getCenter();

    this.loadPlaces(
      center.lat,
      center.lng
    );

  }

  async loadPlaces(
    latitude: number,
    longitude: number
  ) {

    this.markers.forEach(
      marker => marker.remove()
    );

    this.markers = [];

    const categories =
      [
        'catering.cafe',
        'catering.restaurant',
        'leisure.park',
        'entertainment.museum',
        'commercial.shopping_mall',
        'sport.fitness',
        'sport.fitness.gym'
      ].join(',');

    const url =
      `https://api.geoapify.com/v2/places` +
      `?categories=${categories}` +
      `&filter=circle:${longitude},${latitude},5000` +
      `&bias=proximity:${longitude},${latitude}` +
      `&limit=50` +
      `&lang=pt` +
      `&apiKey=${this.API_KEY}`;

    const response =
      await fetch(url);

    const data =
      await response.json();

    const sortedPlaces =
      data.features.sort(
        (a: any, b: any) =>
          (a.properties.distance || 0) -
          (b.properties.distance || 0)
      );

    this.places = sortedPlaces.map(
      (place: any) => ({

        id:
          place.properties.place_id,

        name:
          place.properties.name ||
          'Local',

        category:
          place.properties.categories?.[0] ||
          'Local',

        latitude:
          place.properties.lat,

        longitude:
          place.properties.lon,

        address:
          place.properties.formatted,

        city:
          place.properties.city,

        postcode:
          place.properties.postcode,

        phone:
          place.properties.phone,

        website:
          place.properties.website,

        distance:
          place.properties.distance < 1000
            ? `${Math.round(
              place.properties.distance
            )} m`
            : `${(
              place.properties.distance /
              1000
            ).toFixed(1)} km`,

        image:
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500'

      })
    );

    this.places.forEach(place => {

      const popup =
        new maplibregl.Popup({
          offset: 25
        })
          .setHTML(`
          <div>
            <strong>${place.name}</strong>
            <br>
            <small>${place.category}</small>
          </div>
        `);

      const marker =
        new maplibregl.Marker({
          color: '#ef4444'
        })
          .setLngLat([
            place.longitude,
            place.latitude
          ])
          .setPopup(popup)
          .addTo(this.map);

      this.markers.push(marker);

    });

    // console.log(this.places);

  }

  openPlace(place: any) {

    this.router.navigate(
      ['/place-detail'],
      {
        state: {
          place
        }
      }
    );

  }

}