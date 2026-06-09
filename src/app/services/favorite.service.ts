import { Injectable } from '@angular/core';

import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  getDocs
} from 'firebase/firestore';

import { db } from '../../main';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(
    private authService: AuthService
  ) { }

  async addFavorite(place: any) {

    try {

      const userId =
        this.authService.getLoggedUserId();

      const favoriteRef =
        doc(
          db,
          'users',
          userId!,
          'favorites',
          place.id
        );


      await setDoc(
        favoriteRef,
        {
          id: place.id,
          name: place.name || '',
          category: place.category || '',
          address: place.address || '',
          latitude: place.latitude || 0,
          longitude: place.longitude || 0,
          distance: place.distance || '',
          image: place.image || '',
          createdAt: Date.now()
        }
      );

      // console.log('FAVORITO SALVO');

    } catch (error) {

      console.error(
        'ERRO FIRESTORE:',
        error
      );

    }

  }

  async removeFavorite(
    placeId: string
  ) {

    const userId =
      this.authService.getLoggedUserId();

    if (!userId) return;

    const favoriteRef =
      doc(
        db,
        'users',
        userId,
        'favorites',
        placeId
      );

    await deleteDoc(
      favoriteRef
    );

  }

  async isFavorite(
    placeId: string
  ): Promise<boolean> {

    const userId =
      this.authService.getLoggedUserId();

    if (!userId) {
      return false;
    }

    const favoriteRef =
      doc(
        db,
        'users',
        userId,
        'favorites',
        placeId
      );

    const snapshot =
      await getDoc(
        favoriteRef
      );

    return snapshot.exists();

  }

  async getFavorites() {

    const userId =
      this.authService.getLoggedUserId();

    // console.log('USER ID:', userId);

    if (!userId) {
      return [];
    }

    const favoritesRef =
      collection(
        db,
        'users',
        userId,
        'favorites'
      );

    const snapshot =
      await getDocs(
        favoritesRef
      );

    // console.log(
    //   'DOCS ENCONTRADOS:',
    //   snapshot.docs.length
    // );

    return snapshot.docs.map(
      doc => ({
        id: doc.id,
        ...doc.data()
      })
    );

  }

}