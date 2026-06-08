import { Place } from '../interfaces/place.interface';

export const places: Place[] = [

  {
    id: '1',
    name: 'Café Central',
    category: 'Café',
    image: '../../assets/places/cafe.jpg',
    rating: 4.8,
    reviews: 245,
    distance: '0.3 km',
    openUntil: '21:00',
    favorite: true
  },

  {
    id: '2',
    name: 'Parque Municipal',
    category: 'Parque',
    image: '../../assets/places/parque.jpg',
    rating: 4.5,
    reviews: 180,
    distance: '1.2 km',
    openUntil: 'Sempre',
    favorite: false
  },

  {
    id: '3',
    name: 'Museu Histórico',
    category: 'Museu',
    image: '../../assets/places/museu.jpg',
    rating: 4.7,
    reviews: 320,
    distance: '2.1 km',
    openUntil: '18:00',
    favorite: true
  }

];