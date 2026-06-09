import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';

import { FavoriteService } from '../../services/favorite.service';

import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

import { addIcons } from 'ionicons';

import {
  searchOutline,
  heart
} from 'ionicons/icons';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    FormsModule,
    BottomNavComponent
  ]
})
export class FavoritesPage implements OnInit {

  favorites: any[] = [];

  searchText = '';

  constructor(
    private router: Router,
    private favoriteService: FavoriteService,
    private cdr: ChangeDetectorRef
  ) {

    addIcons({
      searchOutline,
      heart
    });

  }

  async ngOnInit() {

    await this.loadFavorites();

  }

  async ionViewWillEnter() {

    await this.loadFavorites();

  }

  async loadFavorites() {

    this.favorites =
      await this.favoriteService.getFavorites();

    this.cdr.detectChanges();

  }

  get filteredFavorites() {

    if (!this.searchText?.trim()) {

      return this.favorites;

    }

    return this.favorites.filter(place =>
      place.name
        ?.toLowerCase()
        .includes(
          this.searchText.toLowerCase()
        )
    );

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

  async removeFavorite(
    place: any,
    event: Event
  ) {

    event.stopPropagation();

    await this.favoriteService.removeFavorite(
      place.id
    );

    this.favorites =
      this.favorites.filter(
        p => p.id !== place.id
      );

    this.cdr.detectChanges();

  }

}