import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';

import { BottomNavComponent } from '../components/bottom-nav/bottom-nav.component';

import { FavoriteService } from '../services/favorite.service';

import {
  IonContent,
  IonIcon,
  IonInput
} from '@ionic/angular/standalone';

import {
  searchOutline,
  optionsOutline,
  locationOutline,
  heartOutline,
  heart,
  star,
  timeOutline
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

import { Geolocation } from '@capacitor/geolocation';

import { Router } from '@angular/router';

interface Place {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  openUntil: string;
  favorite: boolean;

  latitude?: number;
  longitude?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonInput,
    BottomNavComponent
  ]
})
export class HomePage implements OnInit {

  private GEOAPIFY_API_KEY = '892aa90343044f81abb9cfeab5eeedc4';

  categories = [
    'Todos',
    'Café',
    'Restaurante',
    'Parque',
    'Museu',
    'Shopping',
    'Academia'
  ];

  selectedCategory = signal('Todos');

  places: Place[] = [];

  currentCity = 'Carregando...';

  isLoading = true;

  constructor(
    private router: Router,
    private favoriteService: FavoriteService,
    private cdr: ChangeDetectorRef
  ) {

    addIcons({
      searchOutline,
      optionsOutline,
      locationOutline,
      heartOutline,
      heart,
      star,
      timeOutline
    });

  }

  async ngOnInit() {
    await this.loadNearbyPlaces();
  }

  async loadNearbyPlaces() {

    try {

      this.isLoading = true;

      const position =
        await Geolocation.getCurrentPosition({
          enableHighAccuracy: true
        });

      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      // Buscar cidade atual
      const cityUrl =
        `https://api.geoapify.com/v1/geocode/reverse` +
        `?lat=${latitude}` +
        `&lon=${longitude}` +
        `&apiKey=${this.GEOAPIFY_API_KEY}`;

      const cityResponse =
        await fetch(cityUrl);

      const cityData =
        await cityResponse.json();

      if (
        cityData.features &&
        cityData.features.length > 0
      ) {

        const properties =
          cityData.features[0].properties;

        this.currentCity =
          properties.city ||
          properties.county ||
          properties.state ||
          'Sua localização';

      }

      const geoapifyCategories =
        this.getGeoapifyCategories();

      const url =
        `https://api.geoapify.com/v2/places` +
        `?categories=${geoapifyCategories}` +
        `&filter=circle:${longitude},${latitude},5000` +
        `&bias=proximity:${longitude},${latitude}` +
        `&limit=20` +
        `&lang=pt` +
        `&apiKey=${this.GEOAPIFY_API_KEY}`;

      const response =
        await fetch(url);

      if (!response.ok) {

        throw new Error(
          'Erro ao buscar lugares próximos.'
        );

      }

      const data =
        await response.json();

      this.places = await Promise.all(

        data.features.map(async (feature: any) => {

          const properties =
            feature.properties;

          const placeId =
            properties.place_id ||
            properties.datasource?.raw?.osm_id?.toString();

          const isFavorite =
            await this.favoriteService.isFavorite(placeId);

          return {

            id: placeId,

            name:
              properties.name ||
              'Local sem nome',

            category:
              this.getCategoryFromGeoapify(
                properties.categories
              ),

            image:
              this.getImageByCategory(
                properties.categories
              ),

            rating: 4.5,

            reviews: 0,

            distance:
              this.formatDistance(
                properties.distance
              ),

            openUntil:
              this.getOpenUntil(
                properties
              ),

            latitude:
              properties.lat,

            longitude:
              properties.lon,

            favorite:
              isFavorite

          };

        })

      );

    } catch (error) {

      console.error(error);

      this.currentCity =
        'Localização atual';

      alert(
        'Não foi possível carregar os lugares próximos.'
      );

    } finally {

      this.isLoading = false;

      this.cdr.detectChanges();

    }

  }

  getGeoapifyCategories(): string {

    return [
      'catering.cafe',
      'catering.restaurant',
      'leisure.park',
      'entertainment.museum',
      'commercial.shopping_mall',
      'sport.fitness',
      'sport.fitness.gym'
    ].join(',');

  }

  selectCategory(category: string) {

    this.selectedCategory.set(category);

  }

  async ionViewWillEnter() {

    const favorites =
      await this.favoriteService.getFavorites();

    const favoriteIds =
      favorites.map(
        favorite => favorite.id
      );

    this.places =
      this.places.map(place => ({

        ...place,

        favorite:
          favoriteIds.includes(place.id)

      }));

    this.cdr.detectChanges();

  }

  async toggleFavorite(
    place: Place,
    event: Event
  ) {

    event.stopPropagation();

    if (place.favorite) {

      await this.favoriteService
        .removeFavorite(place.id);

    } else {

      await this.favoriteService
        .addFavorite(place);

    }

    place.favorite =
      await this.favoriteService
        .isFavorite(place.id);

    this.cdr.detectChanges();

  }

  get filteredPlaces() {

    if (this.selectedCategory() === 'Todos') {
      return this.places;
    }

    return this.places.filter(
      place => place.category === this.selectedCategory()
    );

  }

  getCategoryFromGeoapify(categories: string[]): string {

    if (!categories) {
      return 'Local';
    }

    if (categories.includes('catering.cafe')) {
      return 'Café';
    }

    if (categories.includes('catering.restaurant')) {
      return 'Restaurante';
    }

    if (categories.includes('leisure.park')) {
      return 'Parque';
    }

    if (categories.includes('entertainment.museum')) {
      return 'Museu';
    }

    if (categories.includes('commercial.shopping_mall')) {
      return 'Shopping';
    }

    if (categories.includes('sport.fitness') || categories.includes('sport.fitness.gym')) {
      return 'Academia';
    }

    return 'Local';
  }

  getImageByCategory(categories: string[]): string {

    const category = this.getCategoryFromGeoapify(categories);

    if (category === 'Café') {
      return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800';
    }

    if (category === 'Restaurante') {
      return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
    }

    if (category === 'Parque') {
      return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800';
    }

    if (category === 'Museu') {
      return 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800';
    }

    if (category === 'Shopping') {
      return 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800';
    }

    if (category === 'Academia') {
      return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800';
    }

    return 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800';
  }

  formatDistance(distance: number): string {

    if (!distance) {
      return '--';
    }

    if (distance < 1000) {
      return `${Math.round(distance)} m`;
    }

    return `${(distance / 1000).toFixed(1)} km`;
  }

  getOpenUntil(properties: any): string {

    if (properties.opening_hours) {
      return properties.opening_hours;
    }

    return 'não informado';
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